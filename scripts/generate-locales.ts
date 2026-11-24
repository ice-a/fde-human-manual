/**
 * 一次性脚本：用免费翻译接口把简体中文内容翻译成英文和繁体中文。
 * 运行：bun scripts/generate-locales.ts
 * 产物写入 src/data/locales/en.json 与 zh-TW.json（提交进仓库，运行时不依赖网络）。
 *
 * 接口对单条请求限流较严，因此把多条文本用 ||| 拼接后批量翻译，再按分隔符拆回。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { guides } from '../src/data/guides'
import { references, site } from '../src/data/references'
import { ui } from '../src/data/ui'

type Locale = 'en' | 'zh-TW'
const SEP = '|||'
const BATCH_SIZE = 20
const CACHE_FILE = new URL('./.translation-cache.json', import.meta.url)

const hasCJK = (text: string) => /[\u3400-\u9fff]/.test(text)
const cache = new Map<string, string>(
  Object.entries(JSON.parse(await readFile(CACHE_FILE, 'utf8').catch(() => '{}')) as Record<string, string>),
)

async function requestTranslation(text: string, target: Locale): Promise<string> {
  const process = Bun.spawn(
    [
      'curl', '-sS', '--max-time', '25', '-G',
      'https://translate.googleapis.com/translate_a/single',
      '--data-urlencode', 'client=gtx',
      '--data-urlencode', 'sl=zh-CN',
      '--data-urlencode', `tl=${target}`,
      '--data-urlencode', 'dt=t',
      '--data-urlencode', `q=${text}`,
    ],
    { stdout: 'pipe', stderr: 'pipe' },
  )
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])
  if (exitCode !== 0) throw new Error(`curl failed: ${stderr}`)
  const data = JSON.parse(stdout) as Array<Array<[string, string]>>
  return data[0]?.map((segment) => segment[0]).join('') ?? ''
}

async function retry<T>(fn: () => Promise<T>, times = 5): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < times; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const { promise, resolve } = Promise.withResolvers<void>()
      setTimeout(resolve, 4000 * (attempt + 1))
      await promise
    }
  }
  throw lastError
}

async function translateBatch(batch: string[], target: Locale): Promise<string[]> {
  if (batch.length === 1) {
    const text = batch[0]
    if (!hasCJK(text)) return [text]
    const cached = cache.get(`${target}\u0000${text}`)
    if (cached) return [cached]
  }

  const joined = batch.join(SEP)
  const result = await retry(() => requestTranslation(joined, target))
  const parts = result.split(SEP)

  if (parts.length !== batch.length) {
    // 分隔符被翻译器改动时退回逐条翻译，保证数量对齐。
    const fallback: string[] = []
    for (const text of batch) fallback.push(await translateBatch([text], target))
    return fallback
  }

  batch.forEach((source, index) => cache.set(`${target}\u0000${source}`, parts[index]))
  return parts
}

async function translateAll(texts: string[], target: Locale): Promise<string[]> {
  const unique = [...new Set(texts.filter(hasCJK))]
  const batches: string[][] = []
  for (let i = 0; i < unique.length; i += BATCH_SIZE) batches.push(unique.slice(i, i + BATCH_SIZE))

  process.stdout.write(`translating ${unique.length} unique strings in ${batches.length} batches → ${target}\n`)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const pending = batch.filter((text) => !cache.has(`${target}\u0000${text}`))
    if (pending.length) {
      const parts = await translateBatch(pending, target)
      pending.forEach((text, index) => cache.set(`${target}\u0000${text}`, parts[index]))
    }
    await writeFile(CACHE_FILE, JSON.stringify(Object.fromEntries(cache), null, 0), 'utf8')
    if (i % 5 === 0) process.stdout.write(`  batch ${i + 1}/${batches.length}\n`)
    const { promise, resolve } = Promise.withResolvers<void>()
    setTimeout(resolve, 2000)
    await promise
  }

  return texts.map((text) => (hasCJK(text) ? cache.get(`${target}\u0000${text}`) ?? text : text))
}

async function buildPayload(target: Locale) {
  const texts: string[] = []
  const push = (value: string) => {
    texts.push(value)
    return texts.length - 1
  }

  const siteRefs = {
    name: push(site.name),
    slogan: push(site.slogan),
    sub: push(site.sub),
  }
  const uiRefs: Record<string, number> = {}
  for (const [key, value] of Object.entries(ui)) uiRefs[key] = push(value)

  const guideRefs = guides.map((guide) => ({
    name: push(guide.name),
    desc: push(guide.desc),
    longDesc: push(guide.longDesc),
    sourceName: push(guide.sourceName),
    principles: guide.principles.map((principle) => ({
      title: push(principle.title),
      core: push(principle.core),
      actions: principle.actions.map(push),
      remember: push(principle.remember),
      tags: principle.tags.map(push),
    })),
  }))

  const referenceRefs = references.map((reference) => ({
    name: push(reference.name),
    desc: push(reference.desc),
    tag: push(reference.tag),
  }))

  const translated = await translateAll(texts, target)
  const read = (index: number) => translated[index].trim()

  return {
    site: {
      name: read(siteRefs.name),
      slogan: read(siteRefs.slogan),
      sub: read(siteRefs.sub),
    },
    ui: Object.fromEntries(Object.entries(uiRefs).map(([key, index]) => [key, read(index)])),
    guides: guides.map((guide, index) => {
      const ref = guideRefs[index]
      return {
        name: read(ref.name),
        en: guide.en,
        desc: read(ref.desc),
        longDesc: read(ref.longDesc),
        sourceName: read(ref.sourceName),
        principles: guide.principles.map((principle, pIndex) => {
          const pRef = ref.principles[pIndex]
          return {
            title: read(pRef.title),
            core: read(pRef.core),
            actions: pRef.actions.map(read),
            remember: read(pRef.remember),
            tags: pRef.tags.map(read),
          }
        }),
      }
    }),
    references: references.map((reference, index) => {
      const ref = referenceRefs[index]
      return {
        name: read(ref.name),
        desc: read(ref.desc),
        tag: read(ref.tag),
      }
    }),
  }
}

await mkdir(new URL('../src/data/locales/', import.meta.url), { recursive: true })

const payload = await buildPayload('en')
const path = new URL('../src/data/locales/en.json', import.meta.url)
await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
process.stdout.write('wrote en.json\n')
