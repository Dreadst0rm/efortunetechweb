import type { HubOfferLink } from '../handsOn'

export default function HubOfferLinks({ links }: { links: readonly HubOfferLink[] }) {
  return (
    <ul className="ho-offer__links">
      {links.map((link) => (
        <li key={link.type === 'page' ? link.href : link.interest}>
          <a
            className="bp-cta-link"
            href={
              link.type === 'page'
                ? link.href
                : `/contact.html?interest=${encodeURIComponent(link.interest)}`
            }
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}