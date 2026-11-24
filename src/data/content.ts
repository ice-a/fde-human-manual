import type { Locale } from './i18n'
import manifestJson from './content/manifest.json'

export interface ContentItem {
  id: string
  title: string
  core?: string
  body?: string[]
  remember?: string
  tags?: string[]
  sourceUrl?: string
}

export interface ContentSection {
  title: string
  items: ContentItem[]
}

export interface GuideContent {
  slug: string
  sections: ContentSection[]
}

export interface ContentStat {
  count: number
  sections: number
}


export const contentStats = manifestJson as Record<string, ContentStat>
const modules = import.meta.glob(['./content/*.json', '!./content/manifest.json'])


export async function loadGuideContent(slug: string, locale: Locale): Promise<GuideContent | null> {
  const loader = modules[`./content/${slug}.${locale}.json`]
  if (!loader) return null
  const module = (await loader()) as { default: GuideContent }
  return module.default
}
