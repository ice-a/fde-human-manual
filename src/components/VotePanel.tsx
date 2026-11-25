import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { fallbackPoll, loadPoll, type PollData } from '../data/poll'

export function VotePanel() {
  const { locale, t } = useLocale()
  const [data, setData] = useState<PollData>(fallbackPoll)

  useEffect(() => {
    let active = true
    void loadPoll().then((value) => {
      if (active) setData(value)
    })
    return () => {
      active = false
    }
  }, [])

  const en = locale === 'en'
  const title = en ? data.titleEn || data.title : data.title
  const description = en ? data.descriptionEn || data.description : data.description
  const steps = en ? data.stepsEn || data.steps : data.steps
  const template = en ? data.templateEn || data.template : data.template
  const issueUrl = data.issueUrl || data.voteUrl

  return (
    <section className="vote-panel" id="feedback">
      <div className="vote-panel__head">
        <span className="eyebrow">{t('vote.title')}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <ol className="feedback-steps">
        {(steps ?? []).map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {template && (
        <pre className="feedback-template">{template}</pre>
      )}

      <div className="vote-panel__foot">
        <a className="btn" href={issueUrl} target="_blank" rel="noreferrer">
          {t('vote.open')} <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
        {data.formUrl && (
          <a className="btn btn--ghost" href={data.formUrl} target="_blank" rel="noreferrer">
            {t('vote.form')} ↗
          </a>
        )}
        <span className="vote-panel__note">{t('vote.optional')}</span>
      </div>
    </section>
  )
}
