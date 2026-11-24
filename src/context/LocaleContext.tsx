import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { guides, type Guide } from '../data/guides'
import { isLocale, localeData, type Locale, type LocalePayload, type PrincipleText } from '../data/i18n'
import { references, site } from '../data/references'

export interface GuideView {
  slug: string
  no: string
  mark: string
  sourceUrl: string
  name: string
  en: string
  desc: string
  longDesc: string
  sourceName: string
  principles: PrincipleText[]
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  data: LocalePayload
  t: (key: string) => string
  content: {
    site: typeof site
    guides: GuideView[]
    references: { no: string; url: string; name: string; desc: string; tag: string }[]
  }
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const STORAGE_KEY = 'human-manual-locale'

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  return isLocale(saved) ? saved : 'zh-CN'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => {
    const data = localeData[locale]
    const guideViews: GuideView[] = guides.map((base: Guide, index) => ({
      slug: base.slug,
      no: base.no,
      mark: base.mark,
      sourceUrl: base.sourceUrl,
      ...data.guides[index],
    }))

    return {
      locale,
      setLocale,
      data,
      t: (key: string) => data.ui[key] ?? localeData['zh-CN'].ui[key] ?? key,
      content: {
        site: { ...site, ...data.site },
        guides: guideViews,
        references: references.map((base, index) => ({
          no: base.no,
          url: base.url,
          ...data.references[index],
        })),
      },
    }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
