export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <strong>efortune.tech</strong>
          <p>
            Helping organizations turn technology strategy into executable outcomes and
            measurable value.
          </p>
        </div>
        <div>
          <strong>Company</strong>
          <ul>
            <li>
              <a href="/about.html">About</a>
            </li>
            <li>
              <a href="/services.html">Services</a>
            </li>
            <li>
              <a href="/case-studies.html">Case Studies</a>
            </li>
            <li>
              <a href="/insights.html">Insights</a>
            </li>
          </ul>
        </div>
        <div>
          <strong>Contact</strong>
          <p>Chicago, Illinois</p>
          <p>
            <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>
          </p>
        </div>
      </div>
      <p className="site-footer__bottom">© 2026 efortune.tech. All rights reserved.</p>
    </footer>
  )
}
