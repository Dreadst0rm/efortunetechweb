import {
  QUARTERLY_INITIATIVE_PRICE,
  quarterlyNoContract,
  quarterlyProjectIncludes,
  quarterlyProjectIncludesHeading,
} from '../quarterlyInitiative'

type Variant = 'full' | 'short'

export default function QuarterlyProjectIncludes({
  variant = 'full',
  showNoContract = false,
}: {
  variant?: Variant
  showNoContract?: boolean
}) {
  if (variant === 'short') {
    return (
      <div className="qi-includes qi-includes--short">
        <p className="qi-includes__kicker">
          <strong>{QUARTERLY_INITIATIVE_PRICE}</strong> includes:
        </p>
        <ul className="qi-includes__short-list">
          {quarterlyProjectIncludes.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
        {showNoContract && <p className="qi-includes__note">{quarterlyNoContract}</p>}
      </div>
    )
  }

  return (
    <section className="qi-includes" aria-labelledby="qi-includes-title">
      <h2 id="qi-includes-title">{quarterlyProjectIncludesHeading}</h2>
      <ol className="qi-offer-list">
        {quarterlyProjectIncludes.map((item) => (
          <li key={item.title}>
            <strong>{item.title}:</strong> {item.body}
          </li>
        ))}
      </ol>
      {showNoContract && <p className="qi-includes__note">{quarterlyNoContract}</p>}
    </section>
  )
}