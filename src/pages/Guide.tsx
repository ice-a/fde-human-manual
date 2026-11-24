import { useEffect, useMemo, useState } from 'react'
import { PrincipleCard } from '../components/PrincipleCard'
import { useLocale } from '../context/LocaleContext'
import { contentStats, loadGuideContent, type ContentItem, type ContentSection } from '../data/content'

function matches(item: ContentItem, query: string): boolean {
  if (!query) return true
  return [item.title, item.core ?? '', ...(item.body ?? []), item.remember ?? '', ...(item.tags ?? [])]
    .join(' ')
    .toLowerCase()
    .includes(query)
}

export function Guide({ slug }: { slug?: string }) {
  const { t, content, locale } = useLocale()
  const guide = content.guides.find((item) => item.slug === slug)
  const [full, setFull] = useState<ContentSection[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [openVersion, setOpenVersion] = useState(0)
  const [allOpen, setAllOpen] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setQuery('')
    setFull(null)

    if (!slug || !contentStats[slug]) {
      setLoading(false)
      return () => {
        active = false
      }
    }

    void loadGuideContent(slug, locale).then((data) => {
      if (!active) return
      setFull(data?.sections ?? [])
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [slug, locale])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return (full ?? [])
      .map((section) => ({ ...section, items: section.items.filter((item) => matches(item, needle)) }))
      .filter((section) => section.items.length > 0)
  }, [full, query])

  if (!guide) {
    return (
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow">{t('guide.missing.eyebrow')}</p>
          <h1>{t('guide.missing.title')}</h1>
          <p className="about-hero__lead">{t('guide.missing.desc')}</p>
          <p style={{ marginTop: 28 }}>
            <a className="btn" href="#/">
              {t('guide.missing.cta')} <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </section>
    )
  }

  const stats = contentStats[guide.slug]
  const total = stats?.count ?? guide.principles.length

  return (
    <>
      <section className="detail-head">
        <div className="wrap">
          <a className="back-link" href="#/">{t('guide.back')}</a>
          <div className="detail-head__row">
            <div>
              <h1>{guide.name}</h1>
              <div className="detail-head__en">VOL. {guide.no} · {guide.en.toUpperCase()}</div>
            </div>
            <div className="detail-head__stamp">
              <strong>{String(total).padStart(3, '0')}</strong>
              {t('content.items')}
            </div>
          </div>
          <p className="detail-desc">{guide.longDesc}</p>
        </div>
      </section>

      <div className="wrap detail-layout">
        <aside className="detail-index" aria-label={t('guide.index')}>
          <p className="detail-index__title">{t('guide.index')}</p>
          <nav>
            {guide.principles.map((principle, index) => (
              <a
                key={principle.title}
                href={`#/guide/${guide.slug}`}
                onClick={(event) => {
                  event.preventDefault()
                  document.getElementById(`${guide.slug}-${index}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="detail-index__no">{String(index + 1).padStart(2, '0')}</span>
                {principle.title}
              </a>
            ))}
            {filtered.map((section, index) => (
              <a
                key={`section-${index}`}
                href={`#/guide/${guide.slug}`}
                onClick={(event) => {
                  event.preventDefault()
                  document.getElementById(`full-${index}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="detail-index__no">·</span>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div>
          {guide.principles.length > 0 && (
            <>
              <h2 className="content-section__head" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <span>{t('content.featured')}</span>
              </h2>
              {guide.principles.map((principle, index) => (
                <PrincipleCard
                  key={principle.title}
                  principle={principle}
                  index={index}
                  slug={guide.slug}
                  rememberLabel={t('principle.remember')}
                />
              ))}
            </>
          )}

          {stats && (
            <div style={{ marginTop: 56 }}>
              <h2 className="content-section__head">
                <span>{guide.name} · {t('nav.guide')}</span>
                <span className="content-section__count">{total} {t('content.items')}</span>
              </h2>

              <div className="content-toolbar">
                <input
                  className="content-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('content.search')}
                  aria-label={t('content.search')}
                />
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setAllOpen(!allOpen)
                    setOpenVersion((value) => value + 1)
                  }}
                >
                  {allOpen ? t('content.collapseAll') : t('content.expandAll')}
                </button>
              </div>

              {loading && <p className="content-loading">{t('content.loading')}</p>}
              {!loading && !full && <p className="content-loading">{t('content.loadError')}</p>}
              {!loading && full && filtered.length === 0 && (
                <p className="content-empty">{t('content.noResults')}</p>
              )}

              {!loading &&
                filtered.map((section, sectionIndex) => (
                  <section className="content-section" id={`full-${sectionIndex}`} key={`${section.title}-${sectionIndex}`}>
                    <div className="content-section__head">
                      <h2>{section.title}</h2>
                      <span className="content-section__count">
                        {section.items.length} {t('content.items')}
                      </span>
                    </div>
                    {section.items.map((item, itemIndex) => (
                      <details className="content-item" key={`${openVersion}-${sectionIndex}-${item.id}-${itemIndex}`} open={allOpen}>
                        <summary className="content-item__head">
                          <span className="content-item__no">{String(itemIndex + 1).padStart(2, '0')}</span>
                          <span className="content-item__title">{item.title}</span>
                          <span className="content-item__toggle" aria-hidden="true">{allOpen ? '−' : '+'}</span>
                        </summary>
                        <div className="content-item__body">
                          {item.core && <p className="content-item__core">{item.core}</p>}
                          {(item.body ?? []).map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          {item.remember && <div className="content-item__remember">{item.remember}</div>}
                          <div className="content-item__meta">
                            {(item.tags ?? []).map((tag) => (
                              <span className="tag" key={tag}>#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </details>
                    ))}
                  </section>
                ))}
            </div>
          )}

          <div className="source-note">
            {t('guide.source.prefix')} <strong>{guide.sourceName}</strong>
            {t('guide.source.suffix')}
          </div>
        </div>
      </div>
    </>
  )
}
