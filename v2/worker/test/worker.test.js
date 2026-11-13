import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { BASE_HEADERS, handleContact, handleRequest } from '../contact-handler.js';
import { CONTENT_SECURITY_POLICY, DOMAIN, MAX_BODY_BYTES } from '../contact-validation.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = process.env.SITE_ROOT
  ? (process.env.SITE_ROOT.startsWith('/') ? process.env.SITE_ROOT : join(root, process.env.SITE_ROOT))
  : join(root, '../dist');
const CONTACT_HTML = readFileSync(join(siteRoot, 'contact.html'), 'utf8');
const CONTACT_JS = readFileSync(join(siteRoot, 'js/contact.js'), 'utf8');
const SITEKEY = '0x4AAAAAAF8HJhDrsUWEA8c6';
const CONTACT_URL = `https://${DOMAIN}/api/contact`;
const TOKEN_MSG = 'Please complete the check and send your message again.';
const VERIFY_MSG =
  'I could not verify the check right now. Please try sending your message again, or email hello@efortune.tech directly.';

function passFetch(hostname = DOMAIN, action = 'contact') {
  return async () =>
    new Response(JSON.stringify({ success: true, hostname, action }), {
      headers: { 'content-type': 'application/json' },
    });
}

function fields(extra = {}) {
  return {
    name: 'Ed Fortune',
    email: 'ed@example.com',
    company: 'Efortune',
    interest: 'fractional-cio',
    message: 'We would like a consultation about cloud architecture.',
    'cf-turnstile-response': 'tok',
    ...extra,
  };
}

function encode(data) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) params.set(k, v);
  return params;
}

async function submit({
  data = fields(),
  origin = `https://${DOMAIN}`,
  referer,
  omitOrigin = false,
  headers = {},
  contentType = 'application/x-www-form-urlencoded',
  body,
  method = 'POST',
  url = CONTACT_URL,
  env = { TURNSTILE_SECRET: 'test-secret' },
  fetchImpl = passFetch(),
  timeoutMs,
  multipart = false,
} = {}) {
  const sent = [];
  const sendEmail = async (_env, msg) => {
    sent.push(msg);
  };
  const requestHeaders = { ...headers };
  if (!omitOrigin && origin !== undefined) requestHeaders.origin = origin;
  if (referer) requestHeaders.referer = referer;

  let reqBody = body;
  if (reqBody === undefined) {
    if (multipart) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(data)) fd.set(k, v);
      reqBody = fd;
    } else {
      requestHeaders['content-type'] = contentType;
      reqBody = encode(data);
    }
  } else if (contentType && !requestHeaders['content-type']) {
    requestHeaders['content-type'] = contentType;
  }

  const init = { method, headers: requestHeaders, body: method === 'GET' ? undefined : reqBody };
  if (reqBody && typeof reqBody === 'object' && reqBody instanceof ReadableStream) init.duplex = 'half';
  const response = await handleContact(new Request(url, init), env, { sendEmail, fetchImpl, timeoutMs, contactHtml: CONTACT_HTML });
  return { response, sent, text: await response.text() };
}

describe('handleContact status paths', () => {
  it('returns 405 for non-POST', async () => {
    const { response } = await submit({ method: 'GET', body: null, data: {} });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'POST');
  });

  it('returns 415 for unsupported content types', async () => {
    const { response, sent } = await submit({
      contentType: 'application/json',
      body: JSON.stringify({ name: 'Ed' }),
    });
    assert.equal(response.status, 415);
    assert.equal(sent.length, 0);
  });

  it('returns 413 when Content-Length is over the cap', async () => {
    const { response, sent } = await submit({
      headers: { 'content-length': String(MAX_BODY_BYTES + 1) },
      body: 'name=Ed',
    });
    assert.equal(response.status, 413);
    assert.equal(sent.length, 0);
  });

  it('returns 413 when the actual body is over the cap with no Content-Length', async () => {
    const oversized = 'name=Ed&email=ed@example.com&message=' + 'x'.repeat(MAX_BODY_BYTES);
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(oversized));
        controller.close();
      },
    });
    const { response, sent } = await submit({
      contentType: 'application/x-www-form-urlencoded',
      body,
    });
    assert.equal(response.status, 413);
    assert.equal(sent.length, 0);
  });
});

describe('origin, referer, and honeypot', () => {
  it('accepts a v2 staging Origin when ALLOWED_HOSTS includes v2.efortune.tech', async () => {
    const { response, sent } = await submit({
      origin: 'https://v2.efortune.tech',
      env: { TURNSTILE_SECRET: 'test-secret', ALLOWED_HOSTS: 'efortune.tech,www.efortune.tech,v2.efortune.tech' },
      fetchImpl: passFetch('v2.efortune.tech'),
    });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
  });

  it('accepts a www Origin at the worker and sends mail', async () => {
    const { response, sent } = await submit({ origin: `https://www.${DOMAIN}` });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/thanks.html');
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, 'ed@efortune.tech');
    assert.equal(sent[0].from, 'noreply@fortwarp.com');
  });

  it('sends from noreply@fortwarp.com with Reply-To set to the visitor and an efortune.tech subject', async () => {
    const { response, sent } = await submit();
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].from, 'noreply@fortwarp.com');
    assert.equal(sent[0].to, 'ed@efortune.tech');
    assert.equal(sent[0].subject, 'efortune.tech contact form: Ed Fortune');
    assert.match(sent[0].raw, /^From: efortune\.tech website <noreply@fortwarp\.com>\r$/m);
    assert.match(sent[0].raw, /^To: hello@efortune\.tech\r$/m);
    assert.match(sent[0].raw, /^Reply-To: ed@example\.com\r$/m);
    assert.match(sent[0].text, /New contact form message from efortune\.tech/);
  });

  it('falls back to a same-host Referer when Origin is missing', async () => {
    const { response, sent } = await submit({
      omitOrigin: true,
      referer: `https://${DOMAIN}/contact.html`,
    });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
  });

  it('lets the request through when Origin and Referer are both missing', async () => {
    const { response, sent } = await submit({ omitOrigin: true });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
  });

  it('silently 303s a disallowed Origin and a disallowed Referer, and a filled honeypot', async () => {
    const badOrigin = await submit({ origin: 'https://evil.example' });
    assert.equal(badOrigin.response.status, 303);
    assert.equal(badOrigin.sent.length, 0);

    const badReferer = await submit({ omitOrigin: true, referer: 'https://evil.example/x' });
    assert.equal(badReferer.response.status, 303);
    assert.equal(badReferer.sent.length, 0);

    const honey = await submit({ data: fields({ website: 'http://spam.test' }) });
    assert.equal(honey.response.status, 303);
    assert.equal(honey.sent.length, 0);
  });
});

describe('Turnstile responses', () => {
  it('returns a visible 403 when the token is missing, expired, or mismatched', async () => {
    const missing = await submit({ data: fields({ 'cf-turnstile-response': '' }) });
    assert.equal(missing.response.status, 403);
    assert.match(missing.text, new RegExp(TOKEN_MSG));
    assert.equal(missing.sent.length, 0);

    const failed = await submit({
      fetchImpl: async () =>
        new Response(JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }), {
          headers: { 'content-type': 'application/json' },
        }),
    });
    assert.equal(failed.response.status, 403);
    assert.match(failed.text, new RegExp(TOKEN_MSG));

    const host = await submit({
      fetchImpl: async () =>
        new Response(JSON.stringify({ success: true, hostname: 'evil.example', action: 'contact' }), {
          headers: { 'content-type': 'application/json' },
        }),
    });
    assert.equal(host.response.status, 403);

    const action = await submit({
      fetchImpl: async () =>
        new Response(JSON.stringify({ success: true, hostname: DOMAIN, action: 'login' }), {
          headers: { 'content-type': 'application/json' },
        }),
    });
    assert.equal(action.response.status, 403);
  });

  it('returns a visible 503 for siteverify HTTP, non-JSON, and timeout errors', async () => {
    const httpErr = await submit({
      fetchImpl: async () => new Response('nope', { status: 502 }),
    });
    assert.equal(httpErr.response.status, 503);
    assert.match(httpErr.text, new RegExp(VERIFY_MSG));
    assert.equal(httpErr.sent.length, 0);

    const badJson = await submit({
      fetchImpl: async () => new Response('not-json', { status: 200 }),
    });
    assert.equal(badJson.response.status, 503);
    assert.match(badJson.text, new RegExp(VERIFY_MSG));

    const aborting = async () => {
      throw new DOMException('The operation was aborted.', 'TimeoutError');
    };
    const timed = await submit({ fetchImpl: aborting });
    assert.equal(timed.response.status, 503);
    assert.match(timed.text, new RegExp(VERIFY_MSG));
  });

  it('returns 502 when the Turnstile secret is missing', async () => {
    const { response, sent } = await submit({ env: {} });
    assert.equal(response.status, 502);
    assert.equal(sent.length, 0);
  });
});

describe('field handling', () => {
  it('strips control characters from every field before the email', async () => {
    const { response, sent } = await submit({
      data: fields({
        name: 'Ed\r\nBcc: evil@x.com',
        email: 'ed\x00@example.com',
        company: 'Acme\x00Corp',
        interest: 'fractional-\ncio',
        message: 'Please call me about architecture.\x07',
      }),
    });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].subject, 'efortune.tech contact form: EdBcc: evil@x.com');
    assert.doesNotMatch(sent[0].subject, /\r|\n/);
    assert.doesNotMatch(sent[0].text, /\r/);
    assert.doesNotMatch(sent[0].raw, /\nBcc:|\rBcc:/i);
    assert.match(sent[0].raw, /^From: efortune\.tech website <noreply@fortwarp\.com>\r$/m);
    assert.match(sent[0].raw, /^Reply-To: ed@example\.com\r$/m);
    assert.match(sent[0].text, /Name: EdBcc: evil@x.com/);
    assert.match(sent[0].text, /Company: AcmeCorp/);
    assert.match(sent[0].text, /Interest: fractional-cio/);
    assert.match(sent[0].text, /Email: ed@example.com/);
    assert.match(sent[0].text, /Please call me about architecture\./);
  });

  it('sends flagged messages with a [possible spam] subject instead of dropping them', async () => {
    const { response, sent } = await submit({
      data: fields({ message: 'xqzvbnmlkjhgfdswqrtp' }),
    });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].subject, '[possible spam] efortune.tech contact form: Ed Fortune');
    assert.match(sent[0].text, /xqzvbnmlkjhgfdswqrtp/);
  });

  it('does not tag ordinary long compounds as spam', async () => {
    const { response, sent } = await submit({
      data: fields({ message: 'Cybersecurityconsultation' }),
    });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].subject, 'efortune.tech contact form: Ed Fortune');
  });

  it('accepts multipart/form-data submissions', async () => {
    const { response, sent } = await submit({ multipart: true });
    assert.equal(response.status, 303);
    assert.equal(sent.length, 1);
    assert.match(sent[0].text, /Name: Ed Fortune/);
    assert.match(sent[0].text, /Interest: fractional-cio/);
  });

  it('includes company size and driving fields in the notification email', async () => {
    const { response, sent } = await submit({
      data: fields({
        company_size: '200-499',
        driving: 'New CIO left and board wants a roadmap review.',
      }),
    });
    assert.equal(response.status, 303);
    assert.match(sent[0].text, /Company size: 200-499/);
    assert.match(sent[0].text, /What's driving this now:/);
    assert.match(sent[0].text, /roadmap review/);
  });

  it('rejects an unknown interest value', async () => {
    const { response, sent } = await submit({
      data: fields({ interest: 'cloud' }),
    });
    assert.equal(response.status, 400);
    assert.equal(sent.length, 0);
  });

  it('re-renders the contact form with escaped submitted values on a visible error', async () => {
    const { response, text, sent } = await submit({
      data: fields({
        name: 'Ed <script>alert(1)</script>',
        message: 'Please call me about <b>access</b> for our staff.',
        'cf-turnstile-response': '',
      }),
    });
    assert.equal(response.status, 403);
    assert.equal(sent.length, 0);
    assert.match(text, /role="alert"/);
    assert.match(text, /Please complete the check and send your message again/);
    assert.match(text, /value="Ed &lt;script&gt;alert\(1\)&lt;\/script&gt;"/);
    assert.match(text, /Please call me about &lt;b&gt;access&lt;\/b&gt; for our staff\./);
    assert.equal(text.includes('<script>alert(1)</script>'), false);
    assert.match(text, /class="cf-turnstile"/);
    assert.match(text, /<base href="\/">/);
  });
});

describe('bundled contact HTML', () => {
  it('matches dist/contact.html after bundle-contact-html', () => {
    const bundled = readFileSync(join(root, 'contact-html.js'), 'utf8');
    const expected = `/** Bundled contact.html for Worker error-page re-renders. Generated — do not edit by hand. */\nexport const CONTACT_HTML = ${JSON.stringify(CONTACT_HTML)};\n`;
    assert.equal(bundled, expected);
  });
});

describe('widget markup, client script, and CSP', () => {
  it('includes the production sitekey, data-action=contact, and Turnstile script', () => {
    assert.match(CONTACT_HTML, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/);
    assert.match(CONTACT_HTML, new RegExp(`data-sitekey="${SITEKEY}"`));
    assert.match(CONTACT_HTML, /data-action="contact"/);
    assert.match(CONTACT_HTML, /class="cf-turnstile"/);
    assert.doesNotMatch(CONTACT_HTML, /data-theme="auto"/);
    assert.match(CONTACT_HTML, /site-init\.js/);
    assert.match(CONTACT_HTML, /rel="preconnect" href="https:\/\/challenges\.cloudflare\.com"/);
    assert.match(CONTACT_HTML, /action="\/api\/contact"/);
    assert.match(CONTACT_HTML, /method="post"/i);
    assert.match(CONTACT_HTML, /name="website"/);
    assert.doesNotMatch(CONTACT_HTML, /This form is a demonstration/);
    assert.match(CONTACT_HTML, /<noscript>/);
    assert.match(CONTACT_HTML, /mailto:hello@efortune\.tech/);
    assert.doesNotMatch(CONTACT_HTML, /tel:/i);
    assert.doesNotMatch(CONTACT_HTML, /555-0180/);
    assert.doesNotMatch(CONTACT_HTML, /<h3>Phone<\/h3>/);
    assert.match(CONTACT_HTML, /bp-contact-layout/);
    assert.match(CONTACT_HTML, /bp-contact-keystone/);
  });

  it('lets the browser submit the form natively so the Turnstile token is included', () => {
    assert.doesNotMatch(CONTACT_JS, /preventDefault/);
    assert.doesNotMatch(CONTACT_JS, /Simulate form submission/);
    assert.match(CONTACT_JS, /Sending\.\.\./);
    assert.match(CONTACT_JS, /pageshow/);
    assert.match(CONTACT_JS, /e\.persisted/);
  });

  it('uses a Worker CSP that allows Turnstile plus the existing contact-page assets', () => {
    assert.equal(BASE_HEADERS['content-security-policy'], CONTENT_SECURITY_POLICY);
    assert.match(CONTENT_SECURITY_POLICY, /script-src[^;]*https:\/\/challenges\.cloudflare\.com/);
    assert.match(
      CONTENT_SECURITY_POLICY,
      /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/,
    );
    assert.doesNotMatch(CONTENT_SECURITY_POLICY, /script-src[^;]*'unsafe-inline'/);
    assert.match(CONTENT_SECURITY_POLICY, /frame-src[^;]*https:\/\/challenges\.cloudflare\.com/);
    assert.match(CONTENT_SECURITY_POLICY, /connect-src[^;]*https:\/\/challenges\.cloudflare\.com/);
    assert.match(CONTENT_SECURITY_POLICY, /connect-src[^;]*https:\/\/cloudflareinsights\.com/);
    assert.match(CONTENT_SECURITY_POLICY, /style-src[^;]*https:\/\/fonts\.googleapis\.com/);
    assert.match(CONTENT_SECURITY_POLICY, /font-src[^;]*https:\/\/fonts\.gstatic\.com/);
  });
});

describe('handleRequest routing', () => {
  it('routes only /api/contact and 404s everything else', async () => {
    const notFound = await handleRequest(new Request(`https://${DOMAIN}/contact.html`), {});
    assert.equal(notFound.status, 404);

    const get = await handleRequest(new Request(`https://${DOMAIN}/api/contact`), {});
    assert.equal(get.status, 405);
  });
});

describe('wrangler.jsonc', () => {
  it('names efortune-site, disables workers.dev preview, has no routes, and locks send_email', () => {
    const raw = readFileSync(join(root, '../wrangler.jsonc'), 'utf8');
    assert.match(raw, /"name":\s*"efortune-site"/);
    assert.match(raw, /"workers_dev":\s*false/);
    assert.match(raw, /"preview_urls":\s*false/);
    assert.doesNotMatch(raw, /"routes"/);
    assert.match(raw, /"destination_address":\s*"ed@efortune\.tech"/);
    assert.match(raw, /"allowed_sender_addresses":\s*\[\s*"noreply@fortwarp\.com"\s*\]/);
    assert.doesNotMatch(raw, /noreply@efortune\.tech/);
    assert.match(raw, /"ALLOWED_HOSTS":\s*"efortune\.tech,www\.efortune\.tech"/);
    assert.doesNotMatch(raw, /v2\.efortune\.tech/);
    assert.match(raw, /"SITE_ORIGIN":\s*"https:\/\/efortune\.tech"/);
    assert.doesNotMatch(raw, /"routes"/);
  });
});
