/**
 * efortune.tech contact-form handler. Kept free of cloudflare:email so unit
 * tests can import it under Node. The Worker entrypoint wires a static
 * EmailMessage import into sendEmail.
 *
 * This Worker is intended to run only on /api/contact (via a route). The
 * rest of the static site stays on Hostinger, proxied by Cloudflare.
 */

import { CONTACT_HTML } from './contact-html.js';
import {
  CONTENT_SECURITY_POLICY,
  EMAIL_RE,
  EXPECTED_ACTION,
  isAllowedOrigin,
  parseAllowedHosts,
  isGibberishMessage,
  readBoundedFormData,
  renderContactFormError,
  requestClientOrigin,
  stripControls,
  verifyTurnstile,
} from './contact-validation.js';

const DOMAIN = 'efortune.tech';
const SITE = 'efortune.tech';
const HELLO = 'hello@efortune.tech';
const DEST = 'ed@efortune.tech';
const FROM = 'noreply@fortwarp.com';

const LIM = { name: 100, email: 200, company: 150, interest: 60, message: 5000 };

export const BASE_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'strict-transport-security': 'max-age=31536000',
  'content-security-policy': CONTENT_SECURITY_POLICY,
};

const TURNSTILE_TOKEN_ERROR =
  'Please complete the check and send your message again.';
const TURNSTILE_VERIFY_ERROR =
  'We could not verify the check right now. Please try sending your message again, or email us directly.';

const esc = (s) => s.replace(/[\r\n]+/g, ' ').trim();
const b64 = (s) => {
  const b = new TextEncoder().encode(s);
  let bin = '';
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/.{76}/g, '$&\r\n');
};

function formError(message, status = 400, { values = {}, contactHtml = '' } = {}) {
  const html = renderContactFormError(contactHtml, {
    message,
    values,
    title: `Message not sent | ${SITE}`,
  });
  return new Response(html, {
    status,
    headers: { ...BASE_HEADERS, 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function successRedirect() {
  return new Response(null, {
    status: 303,
    headers: { ...BASE_HEADERS, location: '/thanks.html', 'cache-control': 'no-store' },
  });
}

export async function handleContact(req, env, { sendEmail, fetchImpl, timeoutMs, contactHtml = CONTACT_HTML } = {}) {
  const allowedHosts = parseAllowedHosts(env?.ALLOWED_HOSTS);

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...BASE_HEADERS, allow: 'POST', 'content-type': 'text/plain', 'cache-control': 'no-store' },
    });
  }

  const ct = req.headers.get('content-type') || '';
  if (!/application\/x-www-form-urlencoded|multipart\/form-data/i.test(ct)) {
    return formError('Unsupported form encoding.', 415, { contactHtml });
  }

  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > 20_000) {
    return formError('Your message is too long.', 413, { contactHtml });
  }

  // Prefer Origin, then Referer. If a client origin is present but not
  // allowed, swallow the request. If both headers are missing, continue
  // and rely on Turnstile plus the siteverify hostname check.
  const clientOrigin = requestClientOrigin(req);
  if (clientOrigin !== null && !isAllowedOrigin(clientOrigin, req.url, allowedHosts)) {
    return successRedirect();
  }

  let form;
  try {
    form = await readBoundedFormData(req);
  } catch (err) {
    if (err && err.code === 'PAYLOAD_TOO_LARGE') {
      return formError('Your message is too long.', 413, { contactHtml });
    }
    return formError('Could not read the form.', 400, { contactHtml });
  }
  const field = (name) => (typeof form.get(name) === 'string' ? form.get(name).trim() : '');

  // Honeypot filled in → almost certainly a bot. Pretend success, send nothing.
  if (field('website')) return successRedirect();

  // Strip controls from every field before any required/length/email check.
  const d = {};
  for (const [name, limit] of Object.entries(LIM)) {
    d[name] = stripControls(field(name));
  }
  const fail = (message, status = 400) => formError(message, status, { values: d, contactHtml });
  for (const [name, limit] of Object.entries(LIM)) {
    if (d[name].length > limit) {
      return fail(`The ${name} field is too long (max ${limit} characters).`);
    }
  }
  if (!d.name || !d.email || !d.message) {
    return fail('Please fill in your name, email, and message.');
  }
  if (!EMAIL_RE.test(d.email)) {
    return fail('Please enter a valid email address.');
  }

  const possibleSpam = isGibberishMessage(d.message);

  const turnstile = await verifyTurnstile({
    secret: env.TURNSTILE_SECRET,
    token: field('cf-turnstile-response'),
    remoteip: req.headers.get('cf-connecting-ip') || '',
    expectedAction: EXPECTED_ACTION,
    expectedHostnames: allowedHosts,
    fetchImpl,
    timeoutMs,
  });
  if (!turnstile.ok) {
    if (turnstile.reason === 'missing_secret') {
      console.error('TURNSTILE_SECRET is not set; rejecting contact submission');
      return fail(
        'Sorry, we could not send your message right now. Please email us directly.',
        502,
      );
    }
    console.warn('contact turnstile rejected', turnstile.reason);
    if (turnstile.reason === 'siteverify_http' || turnstile.reason === 'siteverify_error') {
      return fail(TURNSTILE_VERIFY_ERROR, 503);
    }
    return fail(TURNSTILE_TOKEN_ERROR, 403);
  }

  const body =
    `New contact form message from ${DOMAIN}\n\nName: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company || '-'}\n` +
    (d.interest ? `Interest: ${d.interest}\n` : '') +
    `IP: ${req.headers.get('cf-connecting-ip') || '-'}\n\nMessage:\n${d.message}\n`;
  const from = FROM;
  const mid = `<${crypto.randomUUID()}@${DOMAIN}>`;
  const subjectPrefix = possibleSpam ? '[possible spam] ' : '';
  const subject = `${subjectPrefix}efortune.tech contact form: ${esc(d.name)}`;
  const raw = [
    `From: ${SITE} website <${from}>`,
    `To: ${HELLO}`,
    `Reply-To: ${esc(d.email)}`,
    `Subject: =?UTF-8?B?${b64(subject).replace(/\r\n/g, '')}?=`,
    `Message-ID: ${mid}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(body),
  ].join('\r\n');

  try {
    await sendEmail(env, { from, to: DEST, raw, subject, text: body });
  } catch (e) {
    console.error('send_email failed', e);
    return fail(
      'Sorry, we could not send your message right now. Please email us directly.',
      502,
    );
  }
  return successRedirect();
}

export function handleRequest(req, env, { handleContact: contact = handleContact } = {}) {
  const u = new URL(req.url);
  if (u.pathname === '/api/contact') return contact(req, env);
  return new Response('Not found', {
    status: 404,
    headers: { ...BASE_HEADERS, 'content-type': 'text/plain', 'cache-control': 'no-store' },
  });
}
