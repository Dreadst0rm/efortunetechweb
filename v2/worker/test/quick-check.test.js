import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isQuickCheckHostname } from '../quick-check-hostname.js';
import { handleQuickCheck, runQuickCheck } from '../quick-check.js';

describe('isQuickCheckHostname', () => {
  it('accepts public domains and rejects literals', () => {
    assert.equal(isQuickCheckHostname('example.com'), true);
    assert.equal(isQuickCheckHostname('mail.example.co.uk'), true);
    assert.equal(isQuickCheckHostname('localhost'), false);
    assert.equal(isQuickCheckHostname('127.0.0.1'), false);
    assert.equal(isQuickCheckHostname('10.0.0.1'), false);
    assert.equal(isQuickCheckHostname('notld'), false);
  });
});

function mockDoh(fixtures) {
  return async (url) => {
    const u = new URL(url);
    const name = u.searchParams.get('name');
    const type = u.searchParams.get('type');
    const key = `${name}:${type}`;
    const body = fixtures[key] ?? { Status: 0, AD: false, Answer: [] };
    return new Response(JSON.stringify(body), {
      headers: { 'content-type': 'application/dns-json' },
    });
  };
}

describe('runQuickCheck', () => {
  it('marks SPF, DMARC, and MX when records exist', async () => {
    const fetchImpl = mockDoh({
      'example.com:TXT': {
        Status: 0,
        AD: true,
        Answer: [{ type: 16, data: '"v=spf1 include:_spf.google.com ~all"' }],
      },
      '_dmarc.example.com:TXT': {
        Status: 0,
        Answer: [{ type: 16, data: '"v=DMARC1; p=reject"' }],
      },
      'example.com:MX': {
        Status: 0,
        Answer: [{ type: 15, data: '10 mail.example.com.' }],
      },
      '_mta-sts.example.com:TXT': { Status: 0, Answer: [] },
      '_smtp._tls.example.com:TXT': { Status: 0, Answer: [] },
    });

    const result = await runQuickCheck('example.com', { fetchImpl, timeoutMs: 2000 });
    const spf = result.checks.find((c) => c.id === 'spf');
    const dmarc = result.checks.find((c) => c.id === 'dmarc');
    const mx = result.checks.find((c) => c.id === 'mx');
    assert.equal(spf?.status, 'pass');
    assert.equal(dmarc?.status, 'pass');
    assert.equal(mx?.status, 'pass');
  });
});

describe('handleQuickCheck', () => {
  it('rejects invalid domains', async () => {
    const res = await handleQuickCheck(
      new Request('https://efortune.tech/api/quick-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: 'https://efortune.tech' },
        body: JSON.stringify({ domain: 'localhost' }),
      }),
      { ALLOWED_HOSTS: 'efortune.tech,www.efortune.tech' },
    );
    assert.equal(res.status, 400);
  });
});
