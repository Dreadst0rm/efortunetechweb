import { useId, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { caseStudyDiagrams, type CaseStudyDiagram, type DiagramNode } from '../case-studies/diagramData'

function Diagram({
  diagram,
  phase,
  focused,
  onFocus,
}: {
  diagram: CaseStudyDiagram
  phase: 'before' | 'after'
  focused: string | null
  onFocus: (id: string | null) => void
}) {
  const state = phase === 'before' ? diagram.before : diagram.after
  const titleId = useId()

  return (
    <figure className="bp-cs-diagram" role="group" aria-labelledby={titleId}>
      <figcaption id={titleId} className="bp-cs-diagram__caption">
        {phase === 'before' ? 'Before' : 'After'} — {diagram.title}
      </figcaption>
      <svg className="bp-cs-diagram__svg" viewBox="0 0 400 260" role="img">
        {state.edges.map(([a, b]) => {
          const na = state.nodes.find((n) => n.id === a)!
          const nb = state.nodes.find((n) => n.id === b)!
          return (
            <line
              key={`${a}-${b}-${phase}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className="bp-cs-diagram__edge"
            />
          )
        })}
        {state.nodes.map((node) => (
          <NodeButton key={node.id} node={node} active={focused === node.id} onFocus={onFocus} />
        ))}
      </svg>
      {focused ? (
        <p className="bp-cs-diagram__detail" role="status">
          <strong>{state.nodes.find((n) => n.id === focused)?.label}</strong>:{' '}
          {state.nodes.find((n) => n.id === focused)?.detail}
        </p>
      ) : (
        <p className="bp-cs-diagram__hint">Tab through components or hover to see what changed.</p>
      )}
    </figure>
  )
}

function NodeButton({
  node,
  active,
  onFocus,
}: {
  node: DiagramNode
  active: boolean
  onFocus: (id: string | null) => void
}) {
  return (
    <g className="bp-cs-diagram__node-wrap">
      <rect
        x={node.x - 52}
        y={node.y - 22}
        width={104}
        height={44}
        rx={6}
        className={active ? 'bp-cs-diagram__node bp-cs-diagram__node--active' : 'bp-cs-diagram__node'}
        tabIndex={0}
        role="button"
        aria-pressed={active}
        aria-label={node.label}
        onMouseEnter={() => onFocus(node.id)}
        onMouseLeave={() => onFocus(null)}
        onFocus={() => onFocus(node.id)}
        onBlur={() => onFocus(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFocus(active ? null : node.id)
          }
        }}
      />
      <text x={node.x} y={node.y + 5} textAnchor="middle" className="bp-cs-diagram__node-label">
        {node.label}
      </text>
    </g>
  )
}

function CaseStudyExplorer({ diagram }: { diagram: CaseStudyDiagram }) {
  const [phase, setPhase] = useState<'before' | 'after'>('before')
  const [focused, setFocused] = useState<string | null>(null)
  const toggleId = useId()

  return (
    <section className="bp-cs-explorer" aria-labelledby={`${toggleId}-title`}>
      <h3 id={`${toggleId}-title`}>{diagram.title}</h3>
      <p className="bp-lead">{diagram.blurb}</p>
      <div className="bp-cs-explorer__toggle">
        <button
          type="button"
          className={phase === 'before' ? 'bp-cs-toggle bp-cs-toggle--active' : 'bp-cs-toggle'}
          aria-pressed={phase === 'before'}
          onClick={() => setPhase('before')}
        >
          Before
        </button>
        <button
          type="button"
          className={phase === 'after' ? 'bp-cs-toggle bp-cs-toggle--active' : 'bp-cs-toggle'}
          aria-pressed={phase === 'after'}
          onClick={() => setPhase('after')}
        >
          After
        </button>
      </div>
      <div
        className={`bp-cs-diagram-stage bp-cs-diagram-stage--${phase}`}
        data-phase={phase}
      >
        <Diagram diagram={diagram} phase={phase} focused={focused} onFocus={setFocused} />
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="bp-cs-island">
      {caseStudyDiagrams.map((d) => (
        <CaseStudyExplorer key={d.slug} diagram={d} />
      ))}
    </div>
  )
}

const mount = document.getElementById('case-studies-island')
if (mount) createRoot(mount).render(<App />)
