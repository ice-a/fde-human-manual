import { sourceLicenses } from '../data/licenses'
import { useLocale } from '../context/LocaleContext'

const platforms = [
  { title: 'Vercel', badgeKey: 'about.deploy.vercel.0', keys: ['about.deploy.vercel.0', 'about.deploy.vercel.1', 'about.deploy.vercel.2', 'about.deploy.vercel.3'] },
  { title: 'Cloudflare Pages', badgeKey: 'about.deploy.cloudflare.0', keys: ['about.deploy.cloudflare.0', 'about.deploy.cloudflare.1', 'about.deploy.cloudflare.2', 'about.deploy.cloudflare.3'] },
  { title: 'GitHub Pages', badgeKey: 'about.deploy.github.0', keys: ['about.deploy.github.0', 'about.deploy.github.1', 'about.deploy.github.2', 'about.deploy.github.3'] },
]

export function About() {
  const { t, content, locale } = useLocale()
  const reasons = [
    { no: t('about.why1.no'), title: t('about.why1.title'), text: t('about.why1.text') },
    { no: t('about.why2.no'), title: t('about.why2.title'), text: t('about.why2.text') },
    { no: t('about.why3.no'), title: t('about.why3.title'), text: t('about.why3.text') },
  ]

  return (
    <>
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow">{t('about.eyebrow')}</p>
          <h1>{t('about.title')}</h1>
          <p className="about-hero__lead">{t('about.lead')}</p>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('about.why.title')}</h2>
            </div>
            <span className="section-head__en">{t('about.why.en')}</span>
          </div>
          <div className="about-grid">
            {reasons.map((reason) => (
              <div className="about-card" key={reason.no}>
                <div className="about-card__no">{reason.no}</div>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('about.sources.title')}</h2>
            </div>
            <span className="section-head__en">{t('about.sources.en')}</span>
          </div>
          <p className="section-lead">{t('about.sources.lead')}</p>
          <div className="ref-list">
            {content.references.map((reference) => (
              <div className="ref-item" key={reference.no}>
                <span className="ref-item__no">{reference.no}</span>
                <h3>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.name} ↗
                  </a>
                </h3>
                <p>{reference.desc}</p>
                <span className="ref-item__tag">{reference.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('about.deploy.title')}</h2>
            </div>
            <span className="section-head__en">{t('about.deploy.en')}</span>
          </div>
          <p className="section-lead">{t('about.deploy.lead')}</p>
          <div className="deploy-grid">
            {platforms.map((platform, index) => (
              <div className="deploy-card" key={platform.title}>
                <span className="deploy-card__badge">platform / 0{index + 1}</span>
                <h3>{platform.title}</h3>
                <ol>
                  {platform.keys.map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="notice">{t('about.notice')}</div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('about.license.title')}</h2>
            </div>
            <span className="section-head__en">{t('about.license.en')}</span>
          </div>
          <p className="section-lead">{t('about.license.lead')}</p>
          <div className="ref-list">
            {sourceLicenses.map((source) => (
              <div className="ref-item" key={source.name}>
                <span className="ref-item__no">
                  {source.mode === 'full' ? '✓' : '·'}
                </span>
                <h3>{source.name}</h3>
                <p>
                  <strong>{source.license}</strong> ·{' '}
                  {locale === 'en' ? source.noteEn : source.note}
                </p>
                <span className="ref-item__tag">
                  {source.mode === 'full' ? t('about.license.full') : t('about.license.index')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="closing">
        <div className="wrap">
          <p className="closing__eyebrow">{t('closing2.eyebrow')}</p>
          <p className="closing__line">{t('closing2.line')}</p>
          <a className="closing__link" href="#/">
            {t('closing2.link')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  )
}
