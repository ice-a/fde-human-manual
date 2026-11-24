// 来源：shengjidaguai-china/goutoujunshi（MIT）。署名由站点 About 页统一处理。
import type { ContentItem, ContentSection } from '../../src/data/content'
import { fetchRaw, plainText, sourceUrl, treePaths, writeContent } from './common'

const REPO = 'shengjidaguai-china/goutoujunshi'
const BRANCH = 'main'
const SLUG = 'love'
const MAX_SECTION = 600

interface RawSection {
  title: string
  lines: string[]
}

/** 只剔除 ```mindmap 围栏；其它代码块保留为正文。 */
function splitMindmap(markdown: string): { body: string; mindmap: string } {
  const body: string[] = []
  const mindmap: string[] = []
  let inside = false
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```mindmap\b/i.test(line)) {
      inside = true
      continue
    }
    if (inside) {
      if (/^\s*```\s*$/.test(line)) inside = false
      else mindmap.push(line)
      continue
    }
    body.push(line)
  }
  return { body: body.join('\n'), mindmap: mindmap.join('\n') }
}

function titleFrom(markdown: string, fallback: string): string {
  const line = markdown.split('\n').find((line) => /^#\s+/.test(line))
  return line ? line.replace(/^#\s+/, '').trim() : fallback
}

function itemId(path: string): string {
  const file = path.split('/').pop()!.replace(/\.md$/, '')
  return file.replace(/^\d{2}-/, '')
}

function isNoise(line: string): boolean {
  return (
    /^```/.test(line) ||
    /^\|[\s:|-]+\|\s*$/.test(line) ||
    /^>\s*（注/.test(line) ||
    /^（注/.test(line)
  )
}

function firstText(markdown: string): string {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^#{1,6}\s/.test(line) && !isNoise(line))
  if (!lines.length) return ''
  let core = plainText(lines[0].replace(/^[-*+]\s+/, ''))
  // 首行只是列表引导句时，补上紧随的要点，避免摘要只剩「同意应当是：」。
  if (/[：:]$/.test(core) || core.length < 16) {
    const next = lines.slice(1, 5).find((line) => {
      const text = plainText(line.replace(/^[-*+]\s+/, ''))
      return text.length >= 12 && !(/^\d+\.\s/.test(line) && text.length < 20)
    })
    if (next) {
      const text = plainText(next.replace(/^[-*+]\s+/, ''))
      core += text.length > 80 ? `${text.slice(0, 80)}…` : text
    }
  }
  return core
}

/** 把行列表压成「节标题：内容摘要」，在标点处截断以控制长度。 */
function summarize(title: string, lines: string[], max = MAX_SECTION): string {
  const budget = Math.max(120, max - title.length - 1)
  const pieces: string[] = []
  for (const line of lines) {
    const text = line.trim()
    if (!text || isNoise(text)) continue
    if (/^#{3,6}\s+/.test(text)) {
      pieces.push(`【${text.replace(/^#+\s+/, '').trim()}】`)
      continue
    }
    pieces.push(plainText(text.replace(/^[-*+]\s+/, '')))
  }
  let content = pieces.join('；').replace(/\s+/g, ' ').trim()
  if (content.length > budget) {
    const cut = content.slice(0, budget)
    let end = cut.length
    for (const mark of ['。', '；', '，', '、']) {
      const index = cut.lastIndexOf(mark)
      if (index >= budget * 0.6) {
        end = index + 1
        break
      }
    }
    const ending = cut.slice(0, end).replace(/[，、；]$/, '')
    content = `${ending.slice(0, budget - 1)}…`
  }
  return `${title}：${content}`
}

function sectionsFrom(markdown: string): RawSection[] {
  const sections: RawSection[] = []
  let current: RawSection | null = null
  for (const line of markdown.split('\n')) {
    if (/^##\s+/.test(line)) {
      current = { title: line.replace(/^##\s+/, '').trim(), lines: [] }
      sections.push(current)
    } else if (current) {
      current.lines.push(line)
    }
  }
  return sections
}

/** 纯 mindmap 文档：以思维导图里的三级标题为节，二级标题是文档标题。 */
function sectionsFromMindmap(mindmap: string): RawSection[] {
  const levels = [3, 2]
  for (const level of levels) {
    const sections: RawSection[] = []
    let current: RawSection | null = null
    const pattern = new RegExp(`^#{${level}}\\s+`)
    for (const line of mindmap.split('\n')) {
      if (pattern.test(line)) {
        current = { title: line.replace(/^#+\s+/, '').trim(), lines: [] }
        sections.push(current)
      } else if (current) {
        current.lines.push(line)
      }
    }
    if (sections.length) return sections
  }
  return []
}

function buildItem(path: string, tag: string, markdown: string): ContentItem {
  const id = itemId(path)
  const { body, mindmap } = splitMindmap(markdown)
  const title = titleFrom(body, id)
  const sections = sectionsFrom(body)
  // 少数实用指南的全部内容都在 mindmap 块内，块后只有免责声明；此时从块内取节。
  const usingMindmap = sections.length === 0 && !!mindmap.trim()
  const used = usingMindmap ? sectionsFromMindmap(mindmap) : sections
  const core = firstText(usingMindmap ? mindmap : body)

  const contents = used.map((section) => summarize(section.title, section.lines))
  const sources = used.find((section) => section.title === '核心来源')
  if (sources) contents.push(summarize('核心来源', sources.lines))

  return {
    id,
    title,
    core,
    body: contents,
    tags: [tag],
    sourceUrl: sourceUrl(REPO, BRANCH, path),
  }
}

const paths = await treePaths(REPO, BRANCH)
const knowledgePaths = paths
  .filter((path) => path.startsWith('references/knowledge/') && path.endsWith('.md'))
  .sort()
const practicalPaths = paths
  .filter((path) => path.startsWith('references/practical/') && path.endsWith('.md'))
  .sort()
const selected = [...knowledgePaths, ...practicalPaths]
if (selected.length !== 43) {
  throw new Error(`expected 43 reference docs, got ${selected.length}`)
}

const fetched = new Map<string, string>()
for (let i = 0; i < selected.length; i += 6) {
  const batch = await Promise.all(
    selected.slice(i, i + 6).map(async (path) => [path, await fetchRaw(REPO, BRANCH, path)] as const),
  )
  for (const [path, markdown] of batch) fetched.set(path, markdown)
}

const sections: ContentSection[] = [
  {
    title: '知识库',
    items: knowledgePaths.map((path) => buildItem(path, '知识库', fetched.get(path)!)),
  },
  {
    title: '实用指南',
    items: practicalPaths.map((path) => buildItem(path, '实用指南', fetched.get(path)!)),
  },
]

await writeContent(SLUG, sections)
