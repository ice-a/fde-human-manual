import { fetchRaw, sourceUrl as githubUrl, writeContent } from './common'
import type { ContentItem, ContentSection } from '../../src/data/content'

const REPO = 'qerssd/HowToAvoidScams'
const BRANCH = 'main'
const EXPECTED_RECORDS = 405
const MAX_PART = 1200
const MAX_TAGS = 8

/** Upstream tools/build_repo.py SLUG: 分类 → book/ 分卷文件名。 */
const BOOK_SLUG: Record<string, string> = {
  '兼职 · 刷单': '01-兼职刷单',
  '洗钱 · 银行卡': '02-洗钱银行卡',
  '网购 · 二手快递': '03-网购二手快递',
  '网赌 · 博彩': '04-网赌博彩',
  '投资 · 虚拟币': '05-投资虚拟币',
  '网贷 · 套路贷': '06-网贷套路贷',
  '情感 · 色情陷阱': '07-情感色情陷阱',
  'AI · 盗号技术': '08-AI盗号技术',
  '冒充 · 公检法': '09-冒充公检法',
  '隐私 · 信息黑市': '10-隐私信息黑市',
  '求职 · 加盟': '11-求职加盟',
  '老人 · 学生 · 宝妈': '12-老人学生宝妈',
  '生活中的坑': '13-生活中的坑',
  '黑灰产大盘': '14-黑灰产大盘',
  '民生 · 缴费票务': '15-民生缴费票务',
  '应急 · 反诈工具': '16-应急反诈工具',
}

const KIND_LABELS: Record<string, string> = {
  step: '套路：',
  trap: '坑：',
  warn: '警示：',
  tip: '防法：',
  law: '法律：',
  end: '醒脑：',
  money: '钱财损失：',
  sec: '章节：',
  p: '说明：',
}

interface BodyLine {
  k: string
  t: string
}

interface Article {
  id: number
  title: string
  col?: string
  cat?: string
  guards?: string[]
  tags?: string[]
  lead?: string
  risks?: string[]
  targets?: string[]
  body: BodyLine[]
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function list(value: string[] | undefined): string[] {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : []
}

function truncate(value: string): string {
  return value.length <= MAX_PART ? value : `${value.slice(0, MAX_PART - 1)}…`
}

/** 按 k 归并正文行：同类合并成一段，保留首次出现顺序。 */
function bodyParagraphs(lines: BodyLine[]): string[] | undefined {
  const groups = new Map<string, string[]>()
  const order: string[] = []

  for (const line of lines) {
    const content = text(line.t)
    if (!content) continue
    const kind = text(line.k) || 'p'
    let group = groups.get(kind)
    if (!group) {
      group = []
      groups.set(kind, group)
      order.push(kind)
    }
    group.push(content)
  }

  const paragraphs = order.map((kind) => {
    const label = KIND_LABELS[kind] ?? `${kind}：`
    return truncate(`${label}${groups.get(kind)!.join(' ')}`)
  })
  return paragraphs.length ? paragraphs : undefined
}

function tagsFor(article: Article): string[] | undefined {
  const cat = text(article.cat)
  const parts = cat.split('·').map(text).filter(Boolean)
  const tags = [...parts, ...list(article.risks), ...list(article.targets), ...list(article.tags)]
  const unique = [...new Set(tags)].slice(0, MAX_TAGS)
  return unique.length ? unique : undefined
}

function toItem(article: Article): ContentItem {
  const cat = text(article.cat)
  const guards = list(article.guards)
  const volume = BOOK_SLUG[cat]

  return {
    id: String(article.id),
    title: text(article.title) || String(article.id),
    core: text(article.lead) || undefined,
    body: bodyParagraphs(article.body),
    remember: guards.length ? guards.join('\n') : undefined,
    tags: tagsFor(article),
    sourceUrl: githubUrl(REPO, BRANCH, volume ? `book/${volume}.md` : 'README.md'),
  }
}

const raw = await fetchRaw(REPO, BRANCH, 'tools/articles.json')
const articles = JSON.parse(raw) as Article[]

if (articles.length !== EXPECTED_RECORDS) {
  throw new Error(`expected ${EXPECTED_RECORDS} articles, got ${articles.length}`)
}
const ids = articles.map((article) => article.id).sort((a, b) => a - b)
for (let i = 0; i < EXPECTED_RECORDS; i++) {
  if (ids[i] !== i + 1) throw new Error(`expected id ${i + 1}, got ${ids[i]}`)
}

const sections: ContentSection[] = []
const byTitle = new Map<string, ContentSection>()

for (const article of articles) {
  // col 是栏目名（多数为空），空值回退到 cat 分类，避免 300+ 篇挤进一个空标题栏目。
  const title = text(article.col) || text(article.cat) || '其它'
  let section = byTitle.get(title)
  if (!section) {
    section = { title, items: [] }
    byTitle.set(title, section)
    sections.push(section)
  }
  section.items.push(toItem(article))
}

await writeContent('avoid-scams', sections)
