/**
 * 把 src/data/content/*.zh-CN.json 全文翻译成英文，输出同名 .en.json。
 * 运行：bun scripts/translate-content.ts
 * 使用免费翻译接口批量处理，带磁盘缓存，可中断后续跑。
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'

const DIR = new URL('../src/data/content/', import.meta.url)
const CACHE_FILE = new URL('./.content-cache.json', import.meta.url)
const ENDPOINT = 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=zh-CN&tl=en'
const SEP = '|||'
const BATCH_SIZE = 20
const MAX_BATCH_CHARS = 5000

const SKIP_KEYS: Record<string, true> = { id: true, slug: true, sourceUrl: true }

const CONCURRENCY = 8

const cache = new Map<string, string>(
  Object.entries(JSON.parse(await readFile(CACHE_FILE, 'utf8').catch(() => '{}')) as Record<string, string>),
)

const hasCJK = (text: string) => /[\u3400-\u9fff]/.test(text)

async function request(text: string): Promise<string> {
  const process = Bun.spawn(
    ['curl', '-fsS', '--max-time', '60', '-X', 'POST', ENDPOINT, '--data-urlencode', `q=${text}`],
    { stdout: 'pipe', stderr: 'pipe' },
  )
  const [out, err, code] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])
  if (code !== 0 || out.trimStart().startsWith('<')) {
    throw new Error(`translate failed: ${err || out.slice(0, 80)}`)
  }
  const data = JSON.parse(out) as string[]
  const result = data[0] ?? ''
  if (!result.trim()) throw new Error('empty translation')
  return result
}

async function retry<T>(fn: () => Promise<T>, times = 4): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < times; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const { promise, resolve } = Promise.withResolvers<void>()
      setTimeout(resolve, 3000 * (attempt + 1))
      await promise
    }
  }
  throw lastError
}

async function translateBatch(batch: string[]): Promise<void> {
  const result = await retry(() => request(batch.join(SEP)))
  const parts = result.split(SEP)
  if (parts.length !== batch.length) {
    for (const text of batch) {
      const single = await retry(() => request(text))
      cache.set(text, single.trim())
    }
    return
  }
  batch.forEach((text, index) => cache.set(text, parts[index].trim()))
}

async function translateAll(texts: string[]): Promise<void> {
  const unique = [...new Set(texts.filter(hasCJK))].filter((text) => !cache.has(text))
  const batches: string[][] = []
  let current: string[] = []
  let size = 0
  for (const text of unique) {
    if (current.length && (current.length >= BATCH_SIZE || size + text.length > MAX_BATCH_CHARS)) {
      batches.push(current)
      current = []
      size = 0
    }
    current.push(text)
    size += text.length
  }
  if (current.length) batches.push(current)

  process.stdout.write(`translating ${unique.length} strings in ${batches.length} batches\n`)

  for (let offset = 0; offset < batches.length; offset += CONCURRENCY) {
    const wave = batches.slice(offset, offset + CONCURRENCY)
    await Promise.all(wave.map((batch) => translateBatch(batch)))
    await writeFile(CACHE_FILE, JSON.stringify(Object.fromEntries(cache), null, 0), 'utf8')
    const done = Math.min(offset + CONCURRENCY, batches.length)
    if (done % 30 === 0 || done === batches.length) process.stdout.write(`  ${done}/${batches.length}\n`)
  }
}

function collect(value: Json, key: string, out: string[]): void {
  if (typeof value === 'string') {
    if (!SKIP_KEYS[key]) out.push(value)
  } else if (Array.isArray(value)) {
    value.forEach((item) => collect(item, key, out))
  } else if (value && typeof value === 'object') {
    for (const [childKey, child] of Object.entries(value)) collect(child, childKey, out)
  }
}

function replace(value: Json, key: string): Json {
  if (typeof value === 'string') {
    if (SKIP_KEYS[key] || !hasCJK(value)) return value
    return cache.get(value) ?? value
  }
  if (Array.isArray(value)) return value.map((item) => replace(item, key))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, replace(child, childKey)]))
  }
  return value
}

const files = (await readdir(DIR)).filter((name) => name.endsWith('.zh-CN.json'))
const payloads = new Map<string, Json>()
const allTexts: string[] = []

for (const file of files) {
  const payload = JSON.parse(await readFile(new URL(file, DIR), 'utf8')) as Json
  payloads.set(file, payload)
  collect(payload, '', allTexts)
}

await translateAll(allTexts)

for (const [file, payload] of payloads) {
  const target = file.replace('.zh-CN.json', '.en.json')
  await writeFile(new URL(target, DIR), `${JSON.stringify(replace(payload, ''), null, 2)}\n`, 'utf8')
  process.stdout.write(`wrote ${target}\n`)
}
