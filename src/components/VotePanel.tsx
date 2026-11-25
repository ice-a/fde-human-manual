import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { fallbackPoll, loadPoll, type PollData } from '../data/poll'

export function VotePanel() {
  const { locale, t } = useLocale()
  const [poll, setPoll] = useState<PollData>(fallbackPoll)

  useEffect(() => {
    let active = true
    void loadPoll().then((data) => {
      if (active) setPoll(data)
    })
    return () => {
      active = false
    }
  }, [])

  const en = locale === 'en'
  const question = en ? poll.questionEn || poll.question : poll.question
  const description = en ? poll.descriptionEn || poll.description : poll.description
  const via = en ? poll.viaEn || poll.via : poll.via

  return (
    <section className="vote-panel" id="vote">
      <div className="vote-panel__head">
        <span className="eyebrow">{t('vote.title')}</span>
        <h2>{question}</h2>
        <p>{description}</p>
      </div>

      <div className="vote-options">
        {poll.options.map((option) => (
          <div className="vote-option" key={option.id}>
            <span className="vote-option__no">{option.id}</span>
            <div>
              <strong>{en ? option.labelEn || option.label : option.label}</strong>
              <span>{en ? option.descEn || option.desc : option.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="vote-panel__foot">
        <a className="btn" href={poll.voteUrl} target="_blank" rel="noreferrer">
          {t('vote.open')} <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
        {poll.formUrl && (
          <a className="btn btn--ghost" href={poll.formUrl} target="_blank" rel="noreferrer">
            {t('vote.form')} ↗
          </a>
        )}
        <span className="vote-panel__note">{via} · {t('vote.optional')}</span>
      </div>
    </section>
  )
}
