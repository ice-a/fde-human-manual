import type { Guide } from '../data/guides'

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <a className="guide-card" href={`#/guide/${guide.slug}`}>
      <span className="guide-card__no">VOL. {guide.no}</span>
      <span className="guide-card__mark" aria-hidden="true">
        {guide.mark}
      </span>
      <h3>{guide.name}</h3>
      <span className="guide-card__en">{guide.en}</span>
      <p className="guide-card__desc">{guide.desc}</p>
      <div className="guide-card__foot">
        <span>{guide.principles.length} 条原则</span>
        <span className="guide-card__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </a>
  )
}
