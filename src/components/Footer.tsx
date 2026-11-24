import { useLocale } from '../context/LocaleContext'

export function Footer() {
  const { t, content } = useLocale()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div>
            <p className="site-footer__name">{content.site.name}</p>
            <p className="site-footer__slogan">{content.site.slogan}</p>
          </div>
          <div className="site-footer__links">
            <a href="#/">{t('footer.catalog')}</a>

            {content.site.repo && (
              <a href={content.site.repo} target="_blank" rel="noreferrer">
                {t('footer.github')}
              </a>
            )}
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>
            © {new Date().getFullYear()} {content.site.name} · {t('footer.credit')}
          </span>
          <span>{t('footer.tagline')}</span>
        </div>
      </div>
    </footer>
  )
}
