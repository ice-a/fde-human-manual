/** 从简体中文源数据用 OpenCC 生成繁体中文语言包。运行：bun scripts/generate-zh-tw.ts */
import { writeFile } from 'node:fs/promises'
import { Converter } from 'opencc-js'
import { localeData } from '../src/data/i18n'

const convert = Converter({ from: 'cn', to: 'tw' })

function toTraditional(value: unknown): unknown {
  if (typeof value === 'string') return convert(value)
  if (Array.isArray(value)) return value.map(toTraditional)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toTraditional(item)]),
    )
  }
  return value
}

const payload = toTraditional(localeData['zh-CN'])
const target = new URL('../src/data/locales/zh-TW.json', import.meta.url)
await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
process.stdout.write('wrote zh-TW.json via OpenCC\n')
