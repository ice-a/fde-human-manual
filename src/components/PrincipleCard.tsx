import type { Principle } from '../data/guides'

export function PrincipleCard({
  principle,
  index,
  slug,
}: {
  principle: Principle
  index: number
  slug: string
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
        <div className="principle__remember">记住：{principle.remember}</div>
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
