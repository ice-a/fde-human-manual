import { fetchRaw, plainText, sourceUrl, writeContent } from './common'
import type { ContentItem, ContentSection } from '../../src/data/content'

const REPO = 'byoungd/up'
const BRANCH = 'main'
const SLUG = 'level-up'
const EXPECTED_ITEMS = 110
const MAX_PROSE = 600
const MAX_TEMPLATE = 2000

const SECTION_ORDER = [
  'threads · part-0',
  'threads · part-1',
  'threads · part-2',
  'threads · part-3',
  'threads · part-4',
  'threads · part-5',
  'threads · part-6',
  'threads · practice',
  'threads · archive',
  'threads · word-list',
  'templates',
  'reference',
  'topics',
  '其它',
]

interface Page {
  path: string
  attrs: Record<string, string>
  content: string
  heading: string
  isTemplate: boolean
  isWordList: boolean
}

interface Segment {
  kind: 'prose' | 'code'
  text: string
}

/** 读取 `---` frontmatter，返回扁平的 key/value 与正文。 */
function parseFrontmatter(raw: string): { attrs: Record<string, string>; content: string } {
  const md = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  if (!md.startsWith('---\n')) return { attrs: {}, content: md }
  const lines = md.split('\n')
  let end = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      end = i
      break
    }
  }
  if (end < 0) return { attrs: {}, content: md }

  const attrs: Record<string, string> = {}
  for (const line of lines.slice(1, end)) {
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (match) attrs[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return { attrs, content: lines.slice(end + 1).join('\n') }
}

function cap(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** 把一段 markdown 散文压成适合单段展示的纯文本。 */
function cleanProse(text: string, joiner = ' '): string {
  const out: string[] = []
  for (const rawLine of text.split('\n')) {
    let line = rawLine.trim()
    if (!line) continue
    if (/^\|[\s|:\-]+\|$/.test(line)) continue
    line = line.replace(/^#{1,6}\s+/, '').replace(/^>\s?/, '')
    line = line.replace(/^\s*[-*+]\s+/, '').replace(/^\d+\.\s+/, '')
    line = line.replace(/\|/g, ' · ')
    line = plainText(line)
    if (line) out.push(line)
  }
  return out.join(joiner).replace(/\s+/g, ' ').trim()
}

/** 按代码围栏切分，代码块原文单独保留，其余按散文处理。 */
function segments(lines: string[]): Segment[] {
  const result: Segment[] = []
  const prose: string[] = []
  let code: string[] = []
  let inFence = false

  const flushProse = () => {
    if (prose.length) {
      result.push({ kind: 'prose', text: prose.join('\n') })
      prose.length = 0
    }
  }

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      if (inFence) {
        result.push({ kind: 'code', text: code.join('\n').trim() })
        code = []
      } else {
        flushProse()
      }
      inFence = !inFence
      continue
    }
    if (inFence) code.push(line)
    else prose.push(line)
  }
  flushProse()
  return result.filter((segment) => segment.text.length > 0)
}

/** 没有 frontmatter.description 时，取 H1 之后的第一段正文。 */
function firstParagraph(content: string): string {
  const buffer: string[] = []
  let started = false
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!started) {
      if (!line || /^(#|>|---|\|)/.test(line)) continue
      started = true
    }
    if (!line || /^#{1,6}\s/.test(line)) break
    buffer.push(line)
  }
  return cleanProse(buffer.join('\n'))
}

function sectionTitle(path: string): string {
  const relative = path.replace(/^docs\//, '').replace(/\.md$/, '')
  const parts = relative.split('/')
  const top = parts[0]
  if (top === 'threads') return parts[1] ? `threads · ${parts[1]}` : 'threads'
  if (top === 'templates' || top === 'reference' || top === 'topics') return top
  return '其它'
}

function toItem(page: Page, tocTitle: string): ContentItem {
  const { path, attrs, content, heading, isTemplate, isWordList } = page
  const lines = content.split('\n')
  const h1 = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, '') ?? ''
  const title = plainText(attrs.title || h1 || tocTitle)

  let body: string[]
  if (isWordList) {
    const terms = lines
      .map((line) => line.trim())
      .filter((line) => line && !/^(#|---|\|)/.test(line))
    body = terms.length ? [cap(terms.join(' · '), MAX_TEMPLATE)] : []
  } else {
    const split: { heading: string; lines: string[] }[] = []
    let current: { heading: string; lines: string[] } | null = null
    let inFence = false
    for (const line of lines) {
      if (/^\s*```/.test(line)) {
        inFence = !inFence
        if (current) current.lines.push(line)
        continue
      }
      const match = inFence ? null : /^##\s+(.+)$/.exec(line)
      if (match) {
        current = { heading: plainText(match[1].trim()), lines: [] }
        split.push(current)
      } else if (current) {
        current.lines.push(line)
      }
    }
    if (!split.length) split.push({ heading: '', lines })

    body = []
    for (const section of split) {
      let firstProse = true
      for (const segment of segments(section.lines)) {
        if (segment.kind === 'code') {
          if (isTemplate) body.push(cap(segment.text, MAX_TEMPLATE))
          continue
        }
        const prose = cleanProse(segment.text)
        if (!prose) continue
        const withHeading = firstProse && section.heading
          ? `${section.heading}：${prose}`
          : prose
        firstProse = false
        body.push(cap(withHeading, MAX_PROSE))
      }
    }
  }

  const sectionName = sectionTitle(path)
  const tagRoot = isTemplate ? 'templates' : sectionName.split(' · ')[0]
  const year = /^\d{4}/.exec(attrs.updated ?? '')?.[0]

  return {
    id: path.replace(/^docs\//, '').replace(/\.md$/, '').replace(/\//g, '-'),
    title,
    core: plainText(attrs.description || firstParagraph(content)),
    body,
    tags: year ? [tagRoot, year] : [tagRoot],
    sourceUrl: sourceUrl(REPO, BRANCH, path),
  }
}

async function fetchPage(path: string): Promise<string> {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetchRaw(REPO, BRANCH, path)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

async function fetchAll(paths: string[]): Promise<string[]> {
  const results = new Array<string>(paths.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (cursor < paths.length) {
        const index = cursor
        cursor += 1
        results[index] = await fetchPage(paths[index])
      }
    }),
  )
  return results
}

const summary = await fetchRaw(REPO, BRANCH, 'SUMMARY.md')
const entries = [...summary.matchAll(/^- \[([^\]]+)\]\(([^)]+\.md)\)\s*$/gm)].map((match) => ({
  title: match[1].trim(),
  path: match[2].trim(),
})).filter((entry) => entry.path.startsWith('docs/')
  && !entry.path.startsWith('docs/en/')
  && !entry.path.startsWith('docs/public/')
  && !entry.path.startsWith('docs/.vitepress/'))

if (entries.length !== EXPECTED_ITEMS) {
  throw new Error(`expected ${EXPECTED_ITEMS} SUMMARY entries, got ${entries.length}`)
}

const rawPages = await fetchAll(entries.map((entry) => entry.path))
const pages: Page[] = entries.map((entry, index) => {
  const { attrs, content } = parseFrontmatter(rawPages[index])
  return {
    path: entry.path,
    attrs,
    content,
    heading: attrs.title || entry.title,
    isTemplate: entry.path.startsWith('docs/templates/'),
    isWordList: entry.path.includes('/word-list/'),
  }
})

const grouped = new Map<string, ContentItem[]>()
for (const [index, page] of pages.entries()) {
  const name = sectionTitle(page.path)
  const items = grouped.get(name) ?? []
  items.push(toItem(page, entries[index].title))
  grouped.set(name, items)
}

const sections: ContentSection[] = []
const sectionNames = [...new Set([...SECTION_ORDER, ...grouped.keys()])]
for (const name of sectionNames) {
  const items = grouped.get(name)
  if (items?.length) sections.push({ title: name, items })
}

const count = sections.reduce((sum, section) => sum + section.items.length, 0)
if (count !== EXPECTED_ITEMS) {
  throw new Error(`expected ${EXPECTED_ITEMS} items, got ${count}`)
}
const emptyBody = sections.flatMap((section) => section.items).filter((item) => !item.body?.length)
if (emptyBody.length) {
  throw new Error(`empty body: ${emptyBody.map((item) => item.id).join(', ')}`)
}

await writeContent(SLUG, sections)
