import { useLocale } from '../context/LocaleContext'

export function About() {
  const { t } = useLocale()

  return (
    <section className="about-hero">
      <div className="wrap">
        <p className="eyebrow">{t('about.eyebrow')}</p>
        <h1>{t('about.title')}</h1>
        <p className="about-hero__lead">{t('about.lead')}</p>
        <p className="about-hero__lead">{t('about.license.lead')}</p>
        <p className="about-hero__lead">{t('about.notice')}</p>
        <p style={{ marginTop: 32 }}>
          <a className="btn" href="#/">
            {t('closing2.link')} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  )
}
