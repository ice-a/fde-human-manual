import enJson from './locales/en.json'

import { guides } from './guides'
import { references, site } from './references'
import { ui } from './ui'

export type Locale = 'zh-CN' | 'en'

export const locales: { code: Locale; label: string; short: string }[] = [
  { code: 'zh-CN', label: '简体中文', short: '简' },
  { code: 'en', label: 'English', short: 'EN' },
]

export interface PrincipleText {
  title: string
  core: string
  actions: string[]
  remember: string
  tags: string[]
}

export interface GuideText {
  name: string
  en: string
  desc: string
  longDesc: string
  sourceName: string
  principles: PrincipleText[]
}

export interface ReferenceText {
  name: string
  desc: string
  tag: string
}

export interface LocalePayload {
  site: { name: string; slogan: string; sub: string }
  ui: Record<string, string>
  guides: GuideText[]
  references: ReferenceText[]
}

const zhCN: LocalePayload = {
  site: { name: site.name, slogan: site.slogan, sub: site.sub },
  ui,
  guides: guides.map((guide) => ({
    name: guide.name,
    en: guide.en,
    desc: guide.desc,
    longDesc: guide.longDesc,
    sourceName: guide.sourceName,
    principles: guide.principles.map((principle) => ({
      title: principle.title,
      core: principle.core,
      actions: principle.actions,
      remember: principle.remember,
      tags: principle.tags,
    })),
  })),
  references: references.map((reference) => ({
    name: reference.name,
    desc: reference.desc,
    tag: reference.tag,
  })),
}

export const localeData: Record<Locale, LocalePayload> = {
  'zh-CN': zhCN,
  en: enJson as LocalePayload,
}

export function isLocale(value: string | null): value is Locale {
  return value === 'zh-CN' || value === 'en'
}
