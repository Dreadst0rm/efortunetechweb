const SITEKEY = '0x4AAAAAAF8HJhDrsUWEA8c6'

export default function ContactPage() {
  return (
    <>
      <header className="bp-article">
        <h1>Get in Touch</h1>
        <p className="bp-lead">
          Let&apos;s discuss how architecture and strategy can accelerate your technology
          outcomes.
        </p>
      </header>
      <div className="bp-contact-grid">
        <div>
          <h2>Start a Conversation</h2>
          <form id="contact-form" className="bp-contact-form" action="/api/contact" method="post">
            <div className="hp" hidden aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              aria-label="Name"
              autoComplete="name"
              maxLength={100}
            />
            <input
              type="email"
              name="email"
              placeholder="Work Email"
              required
              aria-label="Email"
              autoComplete="email"
              maxLength={200}
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              aria-label="Company"
              autoComplete="organization"
              maxLength={150}
            />
            <select name="interest" aria-label="Area of interest" defaultValue="">
              <option value="">Area of Interest</option>
              <option value="cloud">Cloud Architecture</option>
              <option value="software">Software Architecture</option>
              <option value="ai">AI &amp; ML Strategy</option>
              <option value="security">Cybersecurity</option>
              <option value="other">Other / Not Sure</option>
            </select>
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us about your challenge or project..."
              required
              aria-label="Message"
              maxLength={5000}
            />
            <div
              className="cf-turnstile"
              data-sitekey={SITEKEY}
              data-action="contact"
              data-theme="dark"
            />
            <noscript>
              <p>
                JavaScript is required to send this form. Email us at{' '}
                <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>.
              </p>
            </noscript>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <aside className="bp-contact-aside">
          <h3>Email</h3>
          <p>
            <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>
          </p>
          <h3>Phone</h3>
          <p>+1 (312) 555-0180</p>
          <h3>Location</h3>
          <p>
            Chicago, Illinois
            <br />
            Serving clients across North America
          </p>
          <h3>Response Time</h3>
          <p>We typically respond to inquiries within one business day.</p>
        </aside>
      </div>
    </>
  )
}
