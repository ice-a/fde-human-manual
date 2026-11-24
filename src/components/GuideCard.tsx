import type { GuideView } from '../context/LocaleContext'
import { contentStats } from '../data/content'
import { useLocale } from '../context/LocaleContext'

export function GuideCard({ guide }: { guide: GuideView }) {
  const { t } = useLocale()

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
        <span>
          {contentStats[guide.slug]
            ? `${contentStats[guide.slug].count} ${t('content.items')}`
            : t('about.license.index')}
        </span>
        <span className="guide-card__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </a>
  )
}
