import { PrincipleCard } from '../components/PrincipleCard'
import { useLocale } from '../context/LocaleContext'

export function Guide({ slug }: { slug?: string }) {
  const { t, content } = useLocale()
  const guide = content.guides.find((item) => item.slug === slug)

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

  const scrollTo = (index: number) => {
    document.getElementById(`${guide.slug}-${index}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="detail-head">
        <div className="wrap">
          <a className="back-link" href="#/">
            {t('guide.back')}
          </a>
          <div className="detail-head__row">
            <div>
              <h1>{guide.name}</h1>
              <div className="detail-head__en">
                VOL. {guide.no} · {guide.en.toUpperCase()}
              </div>
            </div>
            <div className="detail-head__stamp">
              <strong>{String(guide.principles.length).padStart(2, '0')}</strong>
              {t('guide.stamp')}
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
                  scrollTo(index)
                }}
              >
                <span className="detail-index__no">{String(index + 1).padStart(2, '0')}</span>
                {principle.title}
              </a>
            ))}
          </nav>
        </aside>

        <div>
          {guide.principles.map((principle, index) => (
            <PrincipleCard
              key={principle.title}
              principle={principle}
              index={index}
              slug={guide.slug}
              rememberLabel={t('principle.remember')}
            />
          ))}

          <div className="source-note">
            {t('guide.source.prefix')} <strong>{guide.sourceName}</strong>
            {t('guide.source.suffix')}{' '}
            <a href={guide.sourceUrl} target="_blank" rel="noreferrer">
              {t('guide.source.link')}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
