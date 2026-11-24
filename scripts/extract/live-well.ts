// 来源：eternity4719/HowToLiveBetter，正文按 CC BY 4.0 发布，允许转载、改编（需署名并附原文链接）。
// 站点 About 页统一处理署名；这里保留每条建议的 GitHub blob 原文链接。
import type { ContentItem, ContentSection } from '../../src/data/content'
import { fetchRaw, sourceUrl, treePaths, writeContent } from './common'

const REPO = 'eternity4719/HowToLiveBetter'
const BRANCH = 'main'
const SLUG = 'live-well'
const EXPECTED_COUNT = 772

const ITEM_HEADING = /^### (\d+)\. (.+)$/
const COST_TAG = /^<!--\s*成本标签:\s*(.*?)\s*-->$/
const FIELD = /^- ([^：]+)：(.*)$/
const BOOK_FILE = /^book\/(\d+)-(.+)\.md$/

/** 解析一个 md 文件；字段值允许由后续非空行续接。 */
function parseBookFile(markdown: string, path: string): ContentSection {
  const match = BOOK_FILE.exec(path)
  if (!match) throw new Error(`unexpected book path: ${path}`)
  const [, sectionNo, sectionName] = match
  const lines = markdown.split(/\r?\n/)
  const heads = lines.flatMap((line, index) => (ITEM_HEADING.test(line) ? [index] : []))
  const link = sourceUrl(REPO, BRANCH, path)

  const items: ContentItem[] = heads.map((head, index) => {
    const heading = ITEM_HEADING.exec(lines[head])!
    const fields = new Map<string, string>()
    let costTag = ''
    let lastField = ''

    const end = index + 1 < heads.length ? heads[index + 1] : lines.length
    for (let lineNo = head + 1; lineNo < end; lineNo++) {
      const line = lines[lineNo]
      if (/^#{1,2}\s/.test(line)) break // 下一节或文末附录
      const tag = COST_TAG.exec(line)
      if (tag) {
        costTag = tag[1]
        lastField = ''
        continue
      }
      const field = FIELD.exec(line)
      if (field) {
        fields.set(field[1], field[2].trim())
        lastField = field[1]
        continue
      }
      const continuation = line.trim()
      if (continuation && lastField) {
        fields.set(lastField, `${fields.get(lastField)}\n${continuation}`)
      }
    }

    const tags = costTag
      .split(/\s+/)
      .filter((part) => part.includes('='))
    const grade = fields.get('证据等级')
    if (grade) tags.push(`证据${grade}`)

    const body = ['成本', '收益', '证据等级', '来源', '备注']
      .filter((name) => fields.has(name))
      .map((name) => `${name}：${fields.get(name)}`)

    return {
      id: `${sectionNo}-${heading[1]}`,
      title: heading[2].trim(),
      core: fields.get('说人话'),
      body,
      tags,
      sourceUrl: link,
    }
  })

  return { title: sectionName, items }
}

const paths = (await treePaths(REPO, BRANCH))
  .filter((path) => BOOK_FILE.test(path))
  .sort((a, b) => a.localeCompare(b, 'zh-CN'))

const sections: ContentSection[] = []
for (const path of paths) {
  sections.push(parseBookFile(await fetchRaw(REPO, BRANCH, path), path))
}

const counts = sections.map((section) => `${section.title}: ${section.items.length}`)
const total = sections.reduce((sum, section) => sum + section.items.length, 0)
if (total !== EXPECTED_COUNT) {
  throw new Error(`expected ${EXPECTED_COUNT} items, got ${total}\n${counts.join('\n')}`)
}

await writeContent(SLUG, sections)
