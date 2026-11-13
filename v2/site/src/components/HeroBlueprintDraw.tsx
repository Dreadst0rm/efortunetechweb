/** Compact decorative SVG linework for draw-in (aria-hidden). */
export default function HeroBlueprintDraw() {
  return (
    <svg
      className="bp-hero-draw"
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <circle className="bp-draw bp-draw-cross" cx="400" cy="72" r="28" fill="none" />
      <line className="bp-draw bp-draw-cross" x1="400" y1="52" x2="400" y2="92" />
      <line className="bp-draw bp-draw-cross" x1="380" y1="72" x2="420" y2="72" />
      <rect className="bp-draw bp-draw-stamp" x="332" y="32" width="112" height="40" rx="4" fill="none" />
      <text className="bp-draw bp-draw-label" x="388" y="50">
        APPROVED
      </text>
      <text className="bp-draw bp-draw-label bp-draw-label--sm" x="388" y="64">
        REV A
      </text>
    </svg>
  )
}
