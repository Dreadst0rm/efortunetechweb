import { describe, expect, it } from 'vitest'

/** Mirrors shortLine in quick-check-island (display only; API keeps full messages). */
function shortLine(c: { id: string; status: 'pass' | 'warn' | 'fail' }): string {
  const names: Record<string, string> = {
    spf: 'SPF',
    dmarc: 'DMARC',
    mx: 'MX',
    mta_sts: 'MTA-STS',
    tls_rpt: 'TLS-RPT',
    dnssec: 'DNSSEC',
  }
  const name = names[c.id] ?? c.id
  if (c.status === 'pass') return `${name} — OK`
  if (c.status === 'warn') return `${name} — review`
  return `${name} — unavailable`
}

describe('quick-check short labels', () => {
  it('renders compact one-liners', () => {
    expect(shortLine({ id: 'spf', status: 'pass' })).toBe('SPF — OK')
    expect(shortLine({ id: 'dmarc', status: 'warn' })).toBe('DMARC — review')
  })
})
