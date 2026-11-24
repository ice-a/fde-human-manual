import { site } from '../data/references'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div>
            <p className="site-footer__name">{site.name}</p>
            <p className="site-footer__slogan">{site.slogan}</p>
          </div>
          <div className="site-footer__links">
            <a href="#/">指南目录</a>
            <a href="#/about">关于与部署</a>
            {site.repo && (
              <a href={site.repo} target="_blank" rel="noreferrer">
                GITHUB 源码 ↗
              </a>
            )}
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} {site.name} · 内容整理自开源社区，仅供学习参考</span>
          <span>MADE FOR A CLEARER LIFE</span>
        </div>
      </div>
    </footer>
  )
}
