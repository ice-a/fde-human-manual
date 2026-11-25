import { GuideCard } from '../components/GuideCard'
import { VotePanel } from '../components/VotePanel'
import { Hitokoto } from '../components/Hitokoto'
import { useLocale } from '../context/LocaleContext'
import { contentStats } from '../data/content'

export function Home() {
  const { t, content, locale } = useLocale()
  const totalContent = Object.values(contentStats).reduce((sum, stat) => sum + stat.count, 0)
  const steps = [
    { no: t('how.step1.no'), title: t('how.step1.title'), text: t('how.step1.text') },
    { no: t('how.step2.no'), title: t('how.step2.title'), text: t('how.step2.text') },
    { no: t('how.step3.no'), title: t('how.step3.title'), text: t('how.step3.text') },
  ]

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow enter enter--1">{t('hero.eyebrow')}</div>
            <h1 className={`enter enter--2${locale === 'en' ? ' is-latin' : ''}`}>
              {content.site.name.slice(0, 2)}
              <span className="accent">{content.site.name.slice(2, 4)}</span>
              {content.site.name.slice(4)}
            </h1>
            <p className="hero__sub enter enter--2">
              {content.site.en} — VOL. 01 / 14
            </p>
            <p className="hero__slogan enter enter--3">{content.site.slogan}</p>
            <p className="hero__desc enter enter--3">{content.site.sub} {t('hero.desc')}</p>
            <div className="hero__actions enter enter--3">
              <button type="button" className="btn" onClick={scrollToCatalog}>
                {t('hero.cta.primary')} <span className="btn__arrow" aria-hidden="true">→</span>
              </button>

            </div>
            <div className="hero__meta enter enter--4">
              <span><strong>14</strong> {t('hero.meta.volumes')}</span>
              <span><strong>{totalContent}</strong> {t('hero.meta.principles')}</span>
              <span><strong>100%</strong> {t('hero.meta.opensource')}</span>
            </div>
          </div>

          <div className="hero__art">
            <Hitokoto />
          </div>
        </div>
      </section>

      <section className="section section--rule" id="catalog">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('catalog.title')}</h2>
            </div>
            <span className="section-head__en">{t('catalog.en')}</span>
          </div>
          <p className="section-lead">{t('catalog.lead')}</p>
          <div className="guide-grid">
            {content.guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__title">
              <h2>{t('how.title')}</h2>
            </div>
            <span className="section-head__en">{t('how.en')}</span>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <div className="step" key={step.no}>
                <div className="step__no">{step.no}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <VotePanel />
      </div>

      <section className="closing">
        <div className="wrap">
          <p className="closing__eyebrow">{t('closing1.eyebrow')}</p>
          <p className="closing__line">{t('closing1.line')}</p>
          <a className="closing__link" href="#/about">
            {t('closing1.link')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  )
}
