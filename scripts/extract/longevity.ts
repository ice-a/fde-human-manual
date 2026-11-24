import { fetchRaw, writeContent } from './common'
import type { ContentItem, ContentSection } from '../../src/data/content'

const REPO = 'geekan/HowToLiveLonger'
const BRANCH = 'main'
const EXPECTED_RECORDS = 64

interface EvidenceSource {
  title?: string
  url?: string
}

interface EvidenceRecord {
  id: string
  category?: string
  subcategory?: string
  factor?: string
  verdict?: string
  finding?: string
  effect?: string
  ci?: string
  comparison?: string
  population?: string
  design?: string
  limitations?: string
  action?: string
  grade?: string
  sources?: EvidenceSource[]
}

interface ReaderRecord {
  summary?: string
  takeaway?: string
}

interface EvidenceFile {
  records: EvidenceRecord[]
}

interface ReaderFile {
  records: Record<string, ReaderRecord>
}

function text(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

function label(prefix: string, ...values: (string | undefined)[]): string | undefined {
  const parts = values.map(text).filter(Boolean)
  return parts.length ? `${prefix}${parts.join(' ')}` : undefined
}

function sectionTitle(record: EvidenceRecord): string {
  const parts = [text(record.category), text(record.subcategory)].filter(Boolean)
  return parts.length ? parts.join(' · ') : '其它'
}

function toItem(record: EvidenceRecord, reader: ReaderRecord | undefined): ContentItem {
  const body: string[] = []

  const push = (line: string | undefined) => {
    if (line) body.push(line)
  }

  push(label('判定：', record.verdict))
  push(label('效应量：', record.effect, record.ci, record.comparison))
  push(label('人群：', record.population))
  push(label('设计：', record.design))
  push(label('局限：', record.limitations))

  for (const source of record.sources ?? []) {
    const parts = [text(source.title), text(source.url)].filter(Boolean)
    if (parts.length) push(`证据：${parts.join(' — ')}`)
  }

  push(label('读者摘要：', reader?.summary))

  const tags = [record.grade, record.category, record.subcategory].map(text).filter(Boolean)
  const sourceUrl = record.sources?.map((source) => text(source.url)).find(Boolean)

  return {
    id: record.id,
    title: text(record.factor) || record.id,
    core: text(record.finding) || undefined,
    body: body.length ? body : undefined,
    remember: text(record.action) || undefined,
    tags: tags.length ? tags : undefined,
    sourceUrl: sourceUrl || undefined,
  }
}

const evidence = JSON.parse(await fetchRaw(REPO, BRANCH, 'data/evidence.json')) as EvidenceFile
const readers = JSON.parse(await fetchRaw(REPO, BRANCH, 'locales/readers/zh.json')) as ReaderFile

if (evidence.records.length !== EXPECTED_RECORDS) {
  throw new Error(`expected ${EXPECTED_RECORDS} records, got ${evidence.records.length}`)
}

const sections: ContentSection[] = []
const byTitle = new Map<string, ContentSection>()

for (const record of evidence.records) {
  const title = sectionTitle(record)
  let section = byTitle.get(title)
  if (!section) {
    section = { title, items: [] }
    byTitle.set(title, section)
    sections.push(section)
  }
  section.items.push(toItem(record, readers.records?.[record.id]))
}

await writeContent('longevity', sections)
