import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isQuickCheckHostname } from '../quick-check-hostname.js';
import {
  QUICK_CHECK_JSON_HEADERS,
  classifyDmarcTxts,
  classifyMxAnswers,
  handleQuickCheck,
  isNullMxRdata,
  jsonQuickCheckResponse,
  runQuickCheck,
} from '../quick-check.js';

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

describe('isNullMxRdata', () => {
  it('detects null MX rdata', () => {
    assert.equal(isNullMxRdata('0 .'), true);
    assert.equal(isNullMxRdata('0'), true);
    assert.equal(isNullMxRdata('10 mail.example.com.'), false);
  });
});

describe('classifyMxAnswers', () => {
  it('fails when only null MX is present', () => {
    const result = classifyMxAnswers([{ type: 15, data: '0 .' }]);
    assert.equal(result.status, 'fail');
    assert.match(result.message, /does not accept email/i);
  });
});

describe('classifyDmarcTxts', () => {
  it('reports reject policy as pass', () => {
    const result = classifyDmarcTxts(['v=DMARC1; p=reject; rua=mailto:a@example.com']);
    assert.equal(result.status, 'pass');
    assert.match(result.message, /reject/i);
  });

  it('warns on p=none', () => {
    const result = classifyDmarcTxts(['v=DMARC1; p=none']);
    assert.equal(result.status, 'warn');
    assert.match(result.message, /none/i);
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
    assert.match(dmarc?.message ?? '', /reject/i);
    assert.equal(mx?.status, 'pass');
  });

  it('marks null MX as fail', async () => {
    const fetchImpl = mockDoh({
      'nullmx.example.com:TXT': { Status: 0, AD: false, Answer: [] },
      '_dmarc.nullmx.example.com:TXT': { Status: 0, Answer: [] },
      'nullmx.example.com:MX': {
        Status: 0,
        Answer: [{ type: 15, data: '0 .' }],
      },
      '_mta-sts.nullmx.example.com:TXT': { Status: 0, Answer: [] },
      '_smtp._tls.nullmx.example.com:TXT': { Status: 0, Answer: [] },
    });

    const result = await runQuickCheck('nullmx.example.com', { fetchImpl, timeoutMs: 2000 });
    const mx = result.checks.find((c) => c.id === 'mx');
    assert.equal(mx?.status, 'fail');
    assert.match(mx?.message ?? '', /does not accept email/i);
  });
});

describe('jsonQuickCheckResponse', () => {
  it('sets security headers on JSON responses', () => {
    const res = jsonQuickCheckResponse({ ok: true }, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.match(res.headers.get('content-security-policy') ?? '', /default-src 'none'/);
    assert.equal(res.headers.get('cache-control'), 'no-store');
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
    assert.equal(res.headers.get('x-content-type-options'), QUICK_CHECK_JSON_HEADERS['x-content-type-options']);
  });
});
