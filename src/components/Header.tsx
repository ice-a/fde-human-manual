import { useLocale } from '../context/LocaleContext'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ page }: { page: string }) {
  const { t, content } = useLocale()

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a className="brand" href="#/" aria-label={`${content.site.name} · Home`}>
          <span className="brand__mark" aria-hidden="true" />
          <span>
            <span className="brand__name">{content.site.name}</span>
            <span className="brand__en">{content.site.en}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label={t('nav.guide')}>
          <a href="#/" className={page === 'home' || page === 'guide' ? 'is-active' : ''}>
            {t('nav.guide')}
          </a>

          <a className="site-nav__ext" href="https://020417.xyz/" target="_blank" rel="noreferrer">
            {t('nav.sites')} ↗
          </a>
          {content.site.repo && (
            <a className="site-nav__ext" href={content.site.repo} target="_blank" rel="noreferrer">
              GITHUB ↗
            </a>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
