export type NavPage =
  | 'home'
  | 'services'
  | 'case-studies'
  | 'about'
  | 'insights'
  | 'contact'

const links: { page: NavPage; href: string; label: string }[] = [
  { page: 'home', href: '/index.html', label: 'Home' },
  { page: 'services', href: '/services.html', label: 'Services' },
  { page: 'case-studies', href: '/case-studies.html', label: 'Case Studies' },
  { page: 'about', href: '/about.html', label: 'About' },
  { page: 'insights', href: '/insights.html', label: 'Insights' },
  { page: 'contact', href: '/contact.html', label: 'Contact' },
]

export default function Nav({ active }: { active: NavPage }) {
  return (
    <header className="site-nav">
      <a className="site-nav__brand" href="/index.html">
        efortune<span className="site-nav__dot">.</span>tech
      </a>
      <nav className="site-nav__links" aria-label="Main">
        {links.map((link) =>
          link.page === 'contact' ? (
            <a
              key={link.page}
              href={link.href}
              className={
                active === 'contact'
                  ? 'site-nav__cta site-nav__active'
                  : 'site-nav__cta'
              }
            >
              {link.label}
            </a>
          ) : (
            <a
              key={link.page}
              href={link.href}
              className={active === link.page ? 'site-nav__active' : undefined}
            >
              {link.label}
            </a>
          ),
        )}
      </nav>
    </header>
  )
}
