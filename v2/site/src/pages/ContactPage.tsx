import { companySizes, contactInterests } from '../content'

const SITEKEY = '0x4AAAAAAF8HJhDrsUWEA8c6'

export default function ContactPage() {
  return (
    <>
      <header className="bp-article">
        <h1>Contact</h1>
        <p className="bp-lead">
          Tell me what you are trying to solve. I will reply within one business day.
        </p>
      </header>
      <div className="bp-contact-layout">
        <aside className="bp-contact-keystone" aria-label="Email DNS quick check">
          <div id="quick-check-island" className="bp-qc-mount" tabIndex={-1} />
        </aside>
        <div className="bp-contact-main">
          <div className="bp-contact-grid">
            <div>
              <h2>Start a conversation</h2>
              <form id="contact-form" className="bp-contact-form" action="/api/contact" method="post">
                <div className="hp" hidden aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  aria-label="Name"
                  autoComplete="name"
                  maxLength={100}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
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
                <select name="company_size" aria-label="Company size" defaultValue="">
                  <option value="">Company size</option>
                  {companySizes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select name="interest" aria-label="Interest" defaultValue="">
                  <option value="">What are you interested in?</option>
                  {contactInterests.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
                <textarea
                  name="driving"
                  rows={3}
                  placeholder="What's driving this now?"
                  aria-label="What's driving this now?"
                  maxLength={2000}
                />
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Anything else I should know?"
                  required
                  aria-label="Message"
                  maxLength={5000}
                />
                <div className="cf-turnstile" data-sitekey={SITEKEY} data-action="contact" />
                <noscript>
                  <p>
                    JavaScript is required to send this form. Email me at{' '}
                    <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>.
                  </p>
                </noscript>
                <button type="submit">Send message</button>
              </form>
            </div>
            <aside className="bp-contact-aside">
              <h3>Email</h3>
              <p>
                <a href="mailto:hello@efortune.tech">hello@efortune.tech</a>
              </p>
              <h3>Location</h3>
              <p>
                Chicago, Illinois
                <br />
                Serving clients across North America
              </p>
              <h3>Response time</h3>
              <p>I typically respond within one business day.</p>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
