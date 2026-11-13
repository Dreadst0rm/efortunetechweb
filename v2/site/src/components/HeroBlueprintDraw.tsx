/** Compact decorative SVG linework for draw-in (aria-hidden). */
export default function HeroBlueprintDraw() {
  return (
    <svg
      className="bp-hero-draw"
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect className="bp-draw bp-draw-frame" x="24" y="24" width="432" height="272" fill="none" />
      <circle className="bp-draw bp-draw-cross" cx="240" cy="160" r="36" fill="none" />
      <line className="bp-draw bp-draw-cross" x1="240" y1="118" x2="240" y2="202" />
      <line className="bp-draw bp-draw-cross" x1="198" y1="160" x2="282" y2="160" />
      <rect className="bp-draw bp-draw-stamp" x="332" y="32" width="112" height="40" rx="4" fill="none" />
      <text className="bp-draw bp-draw-label" x="388" y="50">
        APPROVED
      </text>
      <text className="bp-draw bp-draw-label bp-draw-label--sm" x="388" y="64">
        REV A
      </text>
      <text className="bp-draw bp-draw-label bp-draw-label--note" x="36" y="302">
        REV A
      </text>
    </svg>
  )
}
