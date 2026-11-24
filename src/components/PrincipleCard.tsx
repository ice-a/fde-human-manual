import type { PrincipleText } from '../data/i18n'

export function PrincipleCard({
  principle,
  index,
  slug,
  rememberLabel,
}: {
  principle: PrincipleText
  index: number
  slug: string
  rememberLabel: string
}) {
  const no = String(index + 1).padStart(2, '0')

  return (
    <article className="principle" id={`${slug}-${index}`}>
      <div className="principle__no">{no}</div>
      <div>
        <h2 className="principle__title">{principle.title}</h2>
        <p className="principle__core">{principle.core}</p>
        <ul className="principle__actions">
          {principle.actions.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
        <div className="principle__remember">
          {rememberLabel}{principle.remember}
        </div>
        <div className="principle__tags">
          {principle.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
