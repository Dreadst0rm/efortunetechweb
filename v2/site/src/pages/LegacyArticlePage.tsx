import type { ReactNode } from 'react'

export default function LegacyArticlePage({
  title,
  lead,
  children,
}: {
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <article className="bp-article">
      <h1>{title}</h1>
      <p className="bp-lead">{lead}</p>
      {children}
    </article>
  )
}
