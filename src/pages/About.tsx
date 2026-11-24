import { useLocale } from '../context/LocaleContext'

const qrCodes = [
  { key: 'support.wechat', file: './pay/wechat.png' },
  { key: 'support.alipay', file: './pay/alipay.png' },
  { key: 'support.qq', file: './pay/qq.png' },
  { key: 'support.usdt', file: './pay/usdt_bnb.png' },
]

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

        <details className="support-block">
          <summary>{t('support.toggle')} · {t('support.title')}</summary>
          <p className="support-desc">{t('support.desc')}</p>
          <div className="support-qr-grid">
            {qrCodes.map((item) => (
              <div className="support-qr" key={item.key}>
                <img src={item.file} alt={t(item.key)} />
                <span>{t(item.key)}</span>
              </div>
            ))}
          </div>
          <p className="support-links">
            <a href="https://www.buymeacoffee.com/leemuzi" target="_blank" rel="noreferrer">
              {t('support.bmc')} ↗
            </a>
          </p>
        </details>

        <p style={{ marginTop: 32 }}>
          <a className="btn" href="#/">
            {t('closing2.link')} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  )
}
