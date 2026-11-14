import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  addNonceToScriptOpenTags,
  buildContentSecurityPolicy,
  generateCspNonce,
  htmlSecurityResponse,
} from '../html-csp.js';

describe('generateCspNonce', () => {
  it('returns unique values per call', () => {
    const seen = new Set();
    for (let i = 0; i < 64; i++) {
      seen.add(generateCspNonce());
    }
    assert.equal(seen.size, 64);
  });
});

describe('buildContentSecurityPolicy', () => {
  const nonce = 'abc123xyz';
  const csp = buildContentSecurityPolicy(nonce);

  it('includes the nonce in script-src', () => {
    assert.match(csp, /script-src[^;]*'nonce-abc123xyz'/);
  });

  it('allows self, Turnstile, and analytics hosts', () => {
    assert.match(csp, /script-src[^;]*'self'/);
    assert.match(csp, /https:\/\/challenges\.cloudflare\.com/);
    assert.match(csp, /https:\/\/static\.cloudflareinsights\.com/);
  });

  it('does not allow unsafe-inline in script-src', () => {
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  });
});

describe('addNonceToScriptOpenTags', () => {
  it('adds the same nonce to every script tag', () => {
    const html =
      '<!DOCTYPE html><html><head><script src="/js/a.js"></script>' +
      '<script type="module" src="/m.js"></script></head><body></body></html>';
    const nonce = 'test-nonce-val';
    const out = addNonceToScriptOpenTags(html, nonce);
    const matches = [...out.matchAll(/nonce="test-nonce-val"/g)];
    assert.equal(matches.length, 2);
  });
});

describe('htmlSecurityResponse', () => {
  it('matches CSP header nonce to every script tag', async () => {
    const html =
      '<html><head><script src="/js/site-init.js"></script>' +
      '<script defer src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>' +
      '</head><body></body></html>';
    const res = htmlSecurityResponse(html, 200, { 'x-test': '1' });
    const csp = res.headers.get('content-security-policy') || '';
    const nonceMatch = /'nonce-([^']+)'/.exec(csp);
    assert.ok(nonceMatch, 'csp missing nonce');
    const nonce = nonceMatch[1];
    const body = await res.text();
    const tags = [...body.matchAll(/<script\b[^>]*>/gi)];
    assert.ok(tags.length >= 2);
    for (const [tag] of tags) {
      assert.match(tag, new RegExp(`nonce="${nonce}"`));
    }
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  });
});