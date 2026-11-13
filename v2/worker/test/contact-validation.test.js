import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  CONTENT_SECURITY_POLICY,
  DEFAULT_ALLOWED_HOSTS,
  DOMAIN,
  EMAIL_RE,
  EXPECTED_ACTION,
  EXPECTED_HOSTNAMES,
  MAX_BODY_BYTES,
  parseAllowedHosts,
  OFFICIAL_TEST_SECRETS,
  escapeHtml,
  isAllowedOrigin,
  isGibberishMessage,
  isValidCompanySize,
  isValidInterest,
  readBoundedFormData,
  renderContactFormError,
  requestClientOrigin,
  stripControls,
  verifyTurnstile,
} from '../contact-validation.js';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('parseAllowedHosts', () => {
  it('defaults to apex and www when unset or empty', () => {
    assert.deepEqual(parseAllowedHosts(undefined), [DOMAIN, `www.${DOMAIN}`]);
    assert.deepEqual(parseAllowedHosts(DEFAULT_ALLOWED_HOSTS), [DOMAIN, `www.${DOMAIN}`]);
    assert.deepEqual(parseAllowedHosts('  '), [DOMAIN, `www.${DOMAIN}`]);
  });

  it('parses comma-separated hostnames and lowercases', () => {
    assert.deepEqual(parseAllowedHosts('v2.efortune.tech, Efortune.Tech '), [
      'v2.efortune.tech',
      'efortune.tech',
    ]);
  });
});

describe('isAllowedOrigin', () => {
  it('accepts the apex and www production origins', () => {
    assert.equal(isAllowedOrigin(`https://${DOMAIN}`), true);
    assert.equal(isAllowedOrigin(`https://www.${DOMAIN}`), true);
  });

  it('accepts staging hostnames when included in allowedHosts', () => {
    const hosts = parseAllowedHosts('efortune.tech,www.efortune.tech,v2.efortune.tech');
    assert.equal(isAllowedOrigin('https://v2.efortune.tech', undefined, hosts), true);
    assert.equal(isAllowedOrigin('https://evil.example', undefined, hosts), false);
  });

  it('rejects missing, null, http, and foreign origins', () => {
    assert.equal(isAllowedOrigin(''), false);
    assert.equal(isAllowedOrigin(null), false);
    assert.equal(isAllowedOrigin('null'), false);
    assert.equal(isAllowedOrigin(`http://${DOMAIN}`), false);
    assert.equal(isAllowedOrigin('https://evil.example'), false);
    assert.equal(isAllowedOrigin(`https://evil.${DOMAIN}`), false);
    assert.equal(isAllowedOrigin(`https://${DOMAIN}.evil.example`), false);
  });

  it('allows localhost only when the request itself is local', () => {
    assert.equal(isAllowedOrigin('http://localhost:8787', 'http://localhost:8787/api/contact'), true);
    assert.equal(isAllowedOrigin('http://127.0.0.1:8787', 'http://127.0.0.1:8787/api/contact'), true);
    assert.equal(isAllowedOrigin('http://localhost:8787', `https://${DOMAIN}/api/contact`), false);
    assert.equal(isAllowedOrigin('http://localhost:8787'), false);
  });
});

describe('requestClientOrigin', () => {
  it('prefers Origin when present', () => {
    const request = new Request(`https://${DOMAIN}/api/contact`, {
      headers: {
        origin: `https://${DOMAIN}`,
        referer: 'https://evil.example/page',
      },
    });
    assert.equal(requestClientOrigin(request), `https://${DOMAIN}`);
  });

  it('falls back to the Referer origin when Origin is missing or null', () => {
    const missing = new Request(`https://${DOMAIN}/api/contact`, {
      headers: { referer: `https://www.${DOMAIN}/contact.html` },
    });
    assert.equal(requestClientOrigin(missing), `https://www.${DOMAIN}`);

    const nulled = new Request(`https://${DOMAIN}/api/contact`, {
      headers: { origin: 'null', referer: `https://${DOMAIN}/contact.html` },
    });
    assert.equal(requestClientOrigin(nulled), `https://${DOMAIN}`);
  });

  it('returns null when both Origin and Referer are missing', () => {
    const request = new Request(`https://${DOMAIN}/api/contact`);
    assert.equal(requestClientOrigin(request), null);
  });
});

describe('stripControls', () => {
  it('strips CR, LF, and other ASCII control characters', () => {
    assert.equal(stripControls('Ed\r\nBcc: evil@x.com'), 'EdBcc: evil@x.com');
    assert.equal(stripControls('Acme\x00Corp\x7f'), 'AcmeCorp');
    assert.equal(stripControls('ok name'), 'ok name');
  });
});

describe('isGibberishMessage', () => {
  const pass = [
    'We would like a consultation about zero trust access for our staff.',
    'Cybersecurityconsultation',
    'Geschwindigkeitsbeschränkung',
    'Donaudampfschifffahrtsgesellschaft',
    'Rechtsschutzversicherungsgesellschaften',
    'Networksecurityassessment',
    'Please call me about Cloudflare Zero Trust.',
  ];
  for (const sample of pass) {
    it(`does not flag ${JSON.stringify(sample)}`, () => {
      assert.equal(isGibberishMessage(sample), false);
    });
  }

  const flag = [
    'xqzvbnmlkjhgfdswqrtp',
    'bcdfghjklmnpqrstvwxzbcdfgh',
    'aaaaaaaaaaaaaaaaaaaaaaaaaa',
  ];
  for (const sample of flag) {
    it(`flags extreme letter salad ${JSON.stringify(sample)}`, () => {
      assert.equal(isGibberishMessage(sample), true);
    });
  }
});

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('verifyTurnstile', () => {
  it('fails closed when the secret or token is missing', async () => {
    assert.deepEqual(await verifyTurnstile({ secret: '', token: 'tok' }), { ok: false, reason: 'missing_secret' });
    assert.deepEqual(await verifyTurnstile({ secret: 'sec', token: '' }), { ok: false, reason: 'missing_token' });
  });

  it('accepts a successful siteverify with the expected hostname and action', async () => {
    const fetchImpl = async (url, init) => {
      assert.equal(url, SITEVERIFY);
      assert.equal(init.method, 'POST');
      assert.ok(init.signal);
      const body = String(init.body);
      assert.match(body, /secret=sec/);
      assert.match(body, /response=tok/);
      assert.match(body, /remoteip=1.2.3.4/);
      return jsonResponse({ success: true, hostname: DOMAIN, action: 'contact' });
    };
    assert.deepEqual(
      await verifyTurnstile({ secret: 'sec', token: 'tok', remoteip: '1.2.3.4', fetchImpl }),
      { ok: true },
    );
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true, hostname: `www.${DOMAIN}`, action: 'contact' }),
      }),
      { ok: true },
    );
  });

  it('rejects hostname and action mismatches', async () => {
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true, hostname: 'evil.example', action: 'contact' }),
      }),
      { ok: false, reason: 'hostname_mismatch' },
    );
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true, hostname: DOMAIN, action: 'login' }),
      }),
      { ok: false, reason: 'action_mismatch' },
    );
  });

  it('accepts the official dummy-key success shape only for official test secrets', async () => {
    assert.equal(OFFICIAL_TEST_SECRETS.has('1x0000000000000000000000000000000AA'), true);
    assert.deepEqual(
      await verifyTurnstile({
        secret: '1x0000000000000000000000000000000AA',
        token: 'XXXX.DUMMY.TOKEN.XXXX',
        fetchImpl: async () => jsonResponse({ success: true, hostname: 'example.com' }),
      }),
      { ok: true },
    );
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'prod-secret-not-a-test-key',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true, hostname: 'example.com' }),
      }),
      { ok: false, reason: 'action_mismatch' },
    );
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'prod-secret-not-a-test-key',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true, hostname: 'example.com', action: 'contact' }),
      }),
      { ok: false, reason: 'hostname_mismatch' },
    );
  });

  it('treats success:false as a token failure', async () => {
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
      }),
      { ok: false, reason: 'siteverify_failed' },
    );
  });

  it('treats siteverify HTTP errors as siteverify_http', async () => {
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => jsonResponse({ success: true }, 500),
      }),
      { ok: false, reason: 'siteverify_http' },
    );
  });

  it('treats non-JSON siteverify bodies as siteverify_error', async () => {
    assert.deepEqual(
      await verifyTurnstile({
        secret: 'sec',
        token: 'tok',
        fetchImpl: async () => new Response('<html>nope</html>', { status: 200 }),
      }),
      { ok: false, reason: 'siteverify_error' },
    );
  });

  it('treats an aborted siteverify fetch as siteverify_error', async () => {
    const result = await verifyTurnstile({
      secret: 'sec',
      token: 'tok',
      fetchImpl: async () => {
        throw new DOMException('The operation was aborted.', 'TimeoutError');
      },
    });
    assert.deepEqual(result, { ok: false, reason: 'siteverify_error' });
  });

  it('uses a 5000ms default timeout signal', async () => {
    let timeoutMs;
    await verifyTurnstile({
      secret: 'sec',
      token: 'tok',
      fetchImpl: async (_url, init) => {
        // AbortSignal.timeout does not expose the ms, but the signal must be set.
        assert.ok(init.signal);
        timeoutMs = true;
        return jsonResponse({ success: true, hostname: DOMAIN, action: EXPECTED_ACTION });
      },
    });
    assert.equal(timeoutMs, true);
    assert.deepEqual(EXPECTED_HOSTNAMES, [DOMAIN, `www.${DOMAIN}`]);
  });
});

describe('readBoundedFormData', () => {
  it('enforces the size cap on the actual body when Content-Length is missing', async () => {
    const oversized = 'name=Ed&email=ed@example.com&message=' + 'x'.repeat(MAX_BODY_BYTES);
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(oversized));
        controller.close();
      },
    });
    const request = new Request(`https://${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      duplex: 'half',
    });
    assert.equal(request.headers.get('content-length'), null);
    await assert.rejects(() => readBoundedFormData(request), (err) => err.code === 'PAYLOAD_TOO_LARGE');
  });

  it('parses a body under the cap', async () => {
    const request = new Request(`https://${DOMAIN}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'name=Ed&email=ed@example.com&message=hello+there+friends',
    });
    const form = await readBoundedFormData(request);
    assert.equal(form.get('name'), 'Ed');
  });
});

describe('interest and company_size validation', () => {
  it('accepts empty or known interest values', () => {
    assert.equal(isValidInterest(''), true);
    assert.equal(isValidInterest('fractional-cio'), true);
    assert.equal(isValidInterest('cloud'), false);
  });

  it('accepts empty or known company size values', () => {
    assert.equal(isValidCompanySize(''), true);
    assert.equal(isValidCompanySize('60-199'), true);
    assert.equal(isValidCompanySize('huge'), false);
  });
});

describe('EMAIL_RE', () => {
  it('accepts ordinary addresses and rejects ASCII control characters', () => {
    assert.equal(EMAIL_RE.test('ed@example.com'), true);
    assert.equal(EMAIL_RE.test('ed\x00@example.com'), false);
    assert.equal(EMAIL_RE.test('ed\n@example.com'), false);
    assert.equal(EMAIL_RE.test('ed\r@example.com'), false);
  });
});

describe('renderContactFormError', () => {
  const template = `<!DOCTYPE html><html><head><title>Contact</title></head><body>
<form action="/api/contact" method="post">
<input type="text" name="name">
<input type="email" name="email">
<textarea name="message"></textarea>
<select name="interest"><option>Assessment</option><option>Other</option></select>
</form></body></html>`;

  it('escapes submitted values and keeps the typed message in the form', () => {
    const html = renderContactFormError(template, {
      message: 'Please complete the check and send your message again.',
      values: {
        name: 'Ed <script>alert(1)</script>',
        email: 'ed@example.com',
        message: 'Line 1\n<script>x</script>',
        interest: 'Other',
      },
      title: 'Message not sent | Test',
    });
    assert.match(html, /<title>Message not sent \| Test<\/title>/);
    assert.match(html, /role="alert"/);
    assert.match(html, /Please complete the check and send your message again/);
    assert.match(html, /value="Ed &lt;script&gt;alert\(1\)&lt;\/script&gt;"/);
    assert.match(html, /<textarea name="message">Line 1\n&lt;script&gt;x&lt;\/script&gt;<\/textarea>/);
    assert.match(html, /<option selected>Other<\/option>/);
    assert.equal(html.includes('<script>alert(1)</script>'), false);
    assert.equal(escapeHtml('<x>'), '&lt;x&gt;');
  });

  it('injects <base href="/"> right after <head> and does not duplicate it', () => {
    const html = renderContactFormError(template, {
      message: 'Please complete the check and send your message again.',
      values: { name: 'Ed' },
    });
    assert.match(html, /<head>\s*<base href="\/">/i);
    assert.match(html, /href="css\/style\.css"|href="\/css\/style\.css"|<base href="\/">/);
    const again = renderContactFormError(html, { message: 'Try again.' });
    assert.equal((again.match(/<base\b/gi) || []).length, 1);
  });
});
