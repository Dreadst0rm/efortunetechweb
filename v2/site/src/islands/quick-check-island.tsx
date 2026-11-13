import { useState } from 'react'
import { createRoot } from 'react-dom/client'

type Check = { id: string; status: 'pass' | 'warn' | 'fail'; message: string }

const CHECK_LABELS: Record<string, string> = {
  spf: 'SPF',
  dmarc: 'DMARC',
  mx: 'MX',
  mta_sts: 'MTA-STS',
  tls_rpt: 'TLS-RPT',
  dnssec: 'DNSSEC',
}

function shortLine(c: Check): string {
  const name = CHECK_LABELS[c.id] ?? c.id
  if (c.status === 'pass') return `${name} — OK`
  if (c.status === 'warn') return `${name} — review`
  return `${name} — unavailable`
}

function QuickCheckApp() {
  const [domain, setDomain] = useState('')
  const [checks, setChecks] = useState<Check[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function runScan() {
    setError('')
    setLoading(true)
    setChecks(null)
    try {
      const res = await fetch('/api/quick-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          data.error === 'invalid_domain'
            ? 'Enter a public domain name.'
            : 'Check could not run. Try again.',
        )
        return
      }
      setChecks(data.checks ?? [])
    } catch {
      setError('Network error. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const scrollToForm = () => {
    const form = document.getElementById('contact-form')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    form?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    const first = form?.querySelector<HTMLInputElement>('input[name="name"]')
    first?.focus()
  }

  return (
    <section className="bp-qc" aria-labelledby="qc-title">
      <h2 id="qc-title">Quick DNS check</h2>
      <p className="bp-qc__intro">Public mail DNS signals only—not a full audit.</p>
      <div className="bp-qc__row">
        <label className="bp-qc__field" htmlFor="qc-domain">
          Domain
        </label>
        <input
          id="qc-domain"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="yourcompany.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          type="button"
          className="bp-qc__run"
          disabled={loading || !domain.trim()}
          onClick={runScan}
        >
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>
      {error ? (
        <p className="bp-qc__error" role="alert">
          {error}
        </p>
      ) : null}
      {checks ? (
        <ul className="bp-qc__list" aria-label="DNS check results">
          {checks.map((c) => (
            <li
              key={c.id}
              className={`bp-qc__item bp-qc__item--${c.status}`}
              aria-label={c.message}
            >
              <span className="bp-qc__badge" aria-hidden="true">
                {c.status === 'pass' ? '✓' : c.status === 'warn' ? '!' : '×'}
              </span>
              <span className="bp-qc__line">{shortLine(c)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="bp-qc__cta">
        Want the full scan?{' '}
        <button type="button" className="bp-qc__link" onClick={scrollToForm}>
          Get in touch
        </button>
      </p>
    </section>
  )
}

const mount = document.getElementById('quick-check-island')
if (mount) createRoot(mount).render(<QuickCheckApp />)
