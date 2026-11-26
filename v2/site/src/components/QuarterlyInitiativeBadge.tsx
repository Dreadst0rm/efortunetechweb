const BADGE_HREF = '/quarterly-initiative'
const BADGE_LABEL = 'See the $9,999.99 Quarterly Initiative offer'

function CompassBracketIcon() {
  return (
    <svg
      className="qi-offer-badge__icon"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M6 9V5H2M22 9V5h4M6 19v4H2M22 19v4h-4"
      />
      <circle cx="14" cy="14" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        fill="currentColor"
        d="M14 8.5 15.2 12.5h4.1l-3.3 2.4 1.3 3.9L14 16.3l-3.3 2.5 1.3-3.9-3.3-2.4h4.1z"
      />
    </svg>
  )
}

export default function QuarterlyInitiativeBadge() {
  return (
    <a className="qi-offer-badge" href={BADGE_HREF} aria-label={BADGE_LABEL}>
      <span className="qi-offer-badge__main">
        <CompassBracketIcon />
        <span className="qi-offer-badge__copy">
          <span className="qi-offer-badge__title">
            Quarterly Initiative, <strong className="qi-offer-badge__price">$9,999.99</strong>
          </span>
          <span className="qi-offer-badge__hint">See the $9,999.99 offer</span>
        </span>
      </span>
    </a>
  )
}