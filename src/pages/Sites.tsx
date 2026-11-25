import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { fallbackSites, loadSites, type SitesData } from '../data/sites'

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function Sites() {
  const { locale, t } = useLocale()
  const [data, setData] = useState<SitesData>(fallbackSites)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    void loadSites().then((value) => {
      if (active) setData(value)
    })
    return () => {
      active = false
    }
  }, [])

  const en = locale === 'en'
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return data.groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          !needle ||
          [item.name, item.nameEn, item.url, item.desc, item.descEn].filter(Boolean).join(' ').toLowerCase().includes(needle),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [data, query])

  const total = data.groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <section className="about-hero">
      <div className="wrap">
        <p className="eyebrow">SITES / DIRECTORY</p>
        <h1>{en ? data.titleEn || data.title : data.title}</h1>
        <p className="about-hero__lead">{en ? data.descriptionEn || data.description : data.description}</p>

        <div className="content-toolbar" style={{ marginTop: 28 }}>
          <input
            className="content-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('sites.search')}
            aria-label={t('sites.search')}
          />
          <span className="content-section__count">{total} {t('sites.count')}</span>
        </div>

        {groups.length === 0 && <p className="content-empty">{t('content.noResults')}</p>}

        {groups.map((group) => (
          <section className="sites-group" key={group.name}>
            <div className="content-section__head">
              <h2>{en ? group.nameEn || group.name : group.name}</h2>
              <span className="content-section__count">{group.items.length}</span>
            </div>
            <div className="sites-grid">
              {group.items.map((item) => (
                <a className="site-card" href={item.url} target="_blank" rel="noreferrer" key={item.url}>
                  <strong>{en ? item.nameEn || item.name : item.name}</strong>
                  <span className="site-card__url">{domain(item.url)} ↗</span>
                  {(item.desc || item.descEn) && (
                    <span className="site-card__desc">{en ? item.descEn || item.desc : item.desc}</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}

        <p style={{ marginTop: 40 }}>
          <a className="btn" href="#/">
            {t('closing2.link')} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  )
}
