/** Decorative SVG linework for CSS/JS draw-in (aria-hidden). */
export default function HeroBlueprintDraw() {
  return (
    <svg
      className="bp-hero-draw"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect className="bp-draw bp-draw-frame" x="40" y="40" width="720" height="520" fill="none" />
      <line className="bp-draw bp-draw-grid" x1="0" y1="120" x2="800" y2="120" />
      <line className="bp-draw bp-draw-grid" x1="0" y1="240" x2="800" y2="240" />
      <line className="bp-draw bp-draw-grid" x1="0" y1="360" x2="800" y2="360" />
      <line className="bp-draw bp-draw-grid" x1="0" y1="480" x2="800" y2="480" />
      <line className="bp-draw bp-draw-grid" x1="160" y1="0" x2="160" y2="600" />
      <line className="bp-draw bp-draw-grid" x1="320" y1="0" x2="320" y2="600" />
      <line className="bp-draw bp-draw-grid" x1="480" y1="0" x2="480" y2="600" />
      <line className="bp-draw bp-draw-grid" x1="640" y1="0" x2="640" y2="600" />
      <circle className="bp-draw bp-draw-cross" cx="400" cy="300" r="60" fill="none" />
      <line className="bp-draw bp-draw-cross" x1="400" y1="220" x2="400" y2="380" />
      <line className="bp-draw bp-draw-cross" x1="320" y1="300" x2="480" y2="300" />
      <rect className="bp-draw bp-draw-stamp" x="580" y="48" width="168" height="56" rx="6" fill="none" />
      <text className="bp-draw bp-draw-label" x="664" y="72">
        APPROVED
      </text>
      <text className="bp-draw bp-draw-label bp-draw-label--sm" x="664" y="92">
        REV A
      </text>
      <text className="bp-draw bp-draw-label bp-draw-label--note" x="56" y="568">
        SCALE 1:1
      </text>
    </svg>
  )
}
