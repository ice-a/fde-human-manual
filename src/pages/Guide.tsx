import { PrincipleCard } from '../components/PrincipleCard'
import { guides } from '../data/guides'

export function Guide({ slug }: { slug?: string }) {
  const guide = guides.find((item) => item.slug === slug)

  if (!guide) {
    return (
      <section className="about-hero">
        <div className="wrap">
          <p className="eyebrow">404 · NOT FOUND</p>
          <h1>这一册还没有写</h1>
          <p className="about-hero__lead">目录里没有找到对应的指南。</p>
          <p style={{ marginTop: 28 }}>
            <a className="btn" href="#/">
              返回目录 <span className="btn__arrow" aria-hidden="true">→</span>
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
            ← 返回目录
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
              条原则
            </div>
          </div>
          <p className="detail-desc">{guide.longDesc}</p>
        </div>
      </section>

      <div className="wrap detail-layout">
        <aside className="detail-index" aria-label="本册目录">
          <p className="detail-index__title">INDEX / 目录</p>
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
            />
          ))}

          <div className="source-note">
            本册内容整理自 <strong>{guide.sourceName}</strong>。原文持续更新，条目可能与原文存在差异；
            涉及健康、法律、投资的具体决定，请以原文和专业意见为准。{' '}
            <a href={guide.sourceUrl} target="_blank" rel="noreferrer">
              查看原始项目 ↗
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
