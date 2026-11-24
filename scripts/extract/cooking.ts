import type { ContentItem, ContentSection } from '../../src/data/content'
import { fetchRaw, plainText, sourceUrl, treePaths, writeContent } from './common'

const REPO = 'Anduin2017/HowToCook'
const BRANCH = 'master'
const SLUG = 'cooking'
const BODY_LIMIT = 1500
const FETCH_CONCURRENCY = 8

const CATEGORY_NAMES = {
  meat_dish: '荤菜',
  vegetable_dish: '素菜',
  staple: '主食',
  aquatic: '水产',
  breakfast: '早餐',
  soup: '汤与粥',
  drink: '饮料',
  dessert: '甜品',
  condiment: '酱料和其它材料',
  'semi-finished': '半成品加工',
} as const

const CATEGORY_COUNTS = {
  meat_dish: 111,
  vegetable_dish: 65,
  staple: 59,
  aquatic: 28,
  breakfast: 25,
  soup: 24,
  drink: 23,
  dessert: 19,
  condiment: 10,
  'semi-finished': 10,
} as const

const RECIPE_HEADINGS = ['必备原料和工具', '计算', '操作', '附加内容'] as const

const TIP_SECTION_ORDER = [
  '技巧·厨房准备',
  '技巧·如何洗碗',
  '技巧·如何选择现在吃什么',
  '技巧·学习',
  '技巧·进阶',
] as const

const H1 = /^#\s+(.+?)\s*$/
const H2 = /^##\s+(.+?)\s*$/
const H3_PLUS = /^#{3,6}\s+(.+?)\s*$/
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g
const RULE = /^[-*_]{3,}$/
const DIFFICULTY = /^预估烹饪难度[：:]\s*(.+?)\s*$/
const CALORIES = /^预估卡路里[：:]\s*(.+?)\s*$/
const FEEDBACK =
  /如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出\s*Issue\s*或\s*Pull\s*request\s*。?/gi

type CategoryKey = keyof typeof CATEGORY_NAMES

const CATEGORY_KEYS = Object.keys(CATEGORY_NAMES) as CategoryKey[]

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}

async function mapLimit<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++
        await worker(items[index]!)
      }
    }),
  )
}

function cleanLine(raw: string): string {
  const line = raw.replace(IMAGE, '').trim()
  if (!line || line.startsWith('```')) return ''
  if (/^#{1,2}\s/.test(line)) return ''
  const heading = line.match(H3_PLUS)
  const text = plainText(heading ? `${heading[1]}：` : line).trim()
  return RULE.test(text) ? '' : text
}

function sectionText(lines: string[], stripFeedback = false): string {
  let text = lines
    .map(cleanLine)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (stripFeedback) text = text.replace(FEEDBACK, '').replace(/\s+/g, ' ').trim()
  return text
}

function limitText(text: string): string {
  const chars = Array.from(text)
  return chars.length <= BODY_LIMIT ? text : `${chars.slice(0, BODY_LIMIT - 1).join('')}…`
}

function parseIntro(lines: string[]) {
  let difficulty = ''
  let calories = ''
  const kept: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    const difficultyMatch = line.match(DIFFICULTY)
    if (difficultyMatch) {
      difficulty = difficultyMatch[1]!
      continue
    }
    const caloriesMatch = line.match(CALORIES)
    if (caloriesMatch) {
      calories = caloriesMatch[1]!
      continue
    }
    const cleaned = cleanLine(raw)
    if (cleaned) kept.push(cleaned)
  }
  return {
    core: kept.join(' ').replace(/\s+/g, ' ').trim(),
    difficulty,
    calories,
  }
}

interface H2Block {
  title: string
  lines: string[]
}

function h2Blocks(lines: string[]): H2Block[] {
  const positions = lines.flatMap((line, index) => {
    const match = line.match(H2)
    return match ? [{ index, title: match[1]!.trim() }] : []
  })
  return positions.map((position, i) => ({
    title: position.title,
    lines: lines.slice(position.index + 1, positions[i + 1]?.index ?? lines.length),
  }))
}

function h1Text(lines: string[], path: string): string {
  const line = lines.find((candidate) => H1.test(candidate))
  assert(line, `${path}: missing H1`)
  return line!.match(H1)![1]!.trim()
}

function parseRecipe(path: string, key: CategoryKey, markdown: string): ContentItem {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const h1Index = lines.findIndex((line) => H1.test(line))
  const blocks = h2Blocks(lines)
  const title = h1Text(lines, path).replace(/的做法$/, '').trim()

  assert(h1Index >= 0, `${path}: missing H1`)
  assert(blocks.length === RECIPE_HEADINGS.length, `${path}: expected 4 H2, got ${blocks.length}`)
  blocks.forEach((block, i) => {
    assert(block.title === RECIPE_HEADINGS[i], `${path}: H2 ${i + 1} is ${block.title}`)
  })

  const introEnd = lines.findIndex((line) => H2.test(line))
  const intro = parseIntro(lines.slice(h1Index + 1, introEnd))
  const body = blocks.map((block, i) => {
    const text = sectionText(block.lines, i === RECIPE_HEADINGS.length - 1)
    return limitText(text ? `${RECIPE_HEADINGS[i]}：${text}` : RECIPE_HEADINGS[i]!)
  })

  const relative = path.slice(`dishes/${key}/`.length, -'.md'.length)
  return {
    id: relative.split('/').join('-'),
    title,
    core: intro.core,
    body,
    remember: '',
    tags: [intro.difficulty, intro.calories, CATEGORY_NAMES[key]].filter(Boolean),
    sourceUrl: sourceUrl(REPO, BRANCH, encodePath(path)),
  }
}

function tipSectionTitle(path: string): string {
  const relative = path.slice('tips/'.length, -'.md'.length)
  const [directory] = relative.split('/')
  if (directory === 'learn') return '技巧·学习'
  if (directory === 'advanced') return '技巧·进阶'
  assert(!relative.includes('/'), `${path}: unexpected tip path`)
  return `技巧·${relative}`
}

function parseTip(path: string, sectionTitle: string, markdown: string): ContentItem {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const h1Index = lines.findIndex((line) => H1.test(line))
  const h2Index = lines.findIndex((line) => H2.test(line))
  const blocks = h2Blocks(lines)
  const title = h1Text(lines, path)

  assert(h1Index >= 0, `${path}: missing H1`)
  const intro = parseIntro(lines.slice(h1Index + 1, h2Index === -1 ? lines.length : h2Index))
  const body = blocks
    .map((block) => {
      const text = sectionText(block.lines)
      return text ? limitText(`${block.title}：${text}`) : ''
    })
    .filter(Boolean)

  const relative = path.slice('tips/'.length, -'.md'.length)
  return {
    id: relative.split('/').join('-'),
    title,
    core: intro.core,
    body,
    remember: '',
    tags: [sectionTitle],
    sourceUrl: sourceUrl(REPO, BRANCH, encodePath(path)),
  }
}

const tree = await treePaths(REPO, BRANCH)
const recipePaths = new Map<CategoryKey, string[]>(CATEGORY_KEYS.map((key) => [key, []]))
const tipPaths: string[] = []

for (const path of tree) {
  const recipeMatch = path.match(/^dishes\/([^/]+)\/.+\.md$/)
  if (recipeMatch) {
    const key = recipeMatch[1]!
    if (key === 'template') continue
    assert(key in CATEGORY_NAMES, `${path}: unknown recipe category`)
    recipePaths.get(key as CategoryKey)!.push(path)
    continue
  }
  if (/^tips\/.+\.md$/.test(path)) tipPaths.push(path)
}

for (const key of CATEGORY_KEYS) {
  const expected = CATEGORY_COUNTS[key]
  const actual = recipePaths.get(key)!.length
  assert(actual === expected, `${key}: expected ${expected} recipes, got ${actual}`)
}
assert(tipPaths.filter((path) => !path.slice('tips/'.length).includes('/')).length === 3, 'expected 3 root tips')
assert(tipPaths.filter((path) => path.startsWith('tips/learn/')).length === 12, 'expected 12 learn tips')
assert(tipPaths.filter((path) => path.startsWith('tips/advanced/')).length === 4, 'expected 4 advanced tips')
assert(tipPaths.length === 19, `expected 19 tips, got ${tipPaths.length}`)

const allPaths = [
  ...CATEGORY_KEYS.flatMap((key) => recipePaths.get(key)!),
  ...tipPaths,
]
const rawByPath = new Map<string, string>()
await mapLimit(allPaths, FETCH_CONCURRENCY, async (path) => {
  rawByPath.set(path, await fetchRaw(REPO, BRANCH, encodePath(path)))
})

const sections: ContentSection[] = CATEGORY_KEYS.map((key) => ({
  title: CATEGORY_NAMES[key],
  items: recipePaths
    .get(key)!
    .map((path) => parseRecipe(path, key, rawByPath.get(path)!)),
}))

const tipGroups = new Map<string, ContentItem[]>()
for (const path of tipPaths) {
  const title = tipSectionTitle(path)
  if (!tipGroups.has(title)) tipGroups.set(title, [])
  tipGroups.get(title)!.push(parseTip(path, title, rawByPath.get(path)!))
}
assert(
  tipGroups.size === TIP_SECTION_ORDER.length,
  `expected ${TIP_SECTION_ORDER.length} tip sections, got ${tipGroups.size}`,
)
for (const title of TIP_SECTION_ORDER) {
  const items = tipGroups.get(title)
  assert(items, `missing tip section ${title}`)
  sections.push({ title, items })
}

const recipeCount = sections
  .slice(0, CATEGORY_KEYS.length)
  .reduce((sum, section) => sum + section.items.length, 0)
const tipCount = sections
  .slice(CATEGORY_KEYS.length)
  .reduce((sum, section) => sum + section.items.length, 0)
assert(recipeCount === 374, `expected 374 recipes, got ${recipeCount}`)
assert(tipCount === 19, `expected 19 tips, got ${tipCount}`)

process.stdout.write(`recipes: ${recipeCount}, tips: ${tipCount}\n`)
await writeContent(SLUG, sections)
