import { site } from '../data/references'

export function Header({ page }: { page: string }) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a className="brand" href="#/" aria-label="人间使用手册 · 返回首页">
          <span className="brand__mark" aria-hidden="true" />
          <span>
            <span className="brand__name">{site.name}</span>
            <span className="brand__en">{site.en}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="主导航">
          <a href="#/" className={page === 'home' || page === 'guide' ? 'is-active' : ''}>
            指南
          </a>
          <a href="#/about" className={page === 'about' ? 'is-active' : ''}>
            关于
          </a>
          {site.repo && (
            <a className="site-nav__ext" href={site.repo} target="_blank" rel="noreferrer">
              GITHUB ↗
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
