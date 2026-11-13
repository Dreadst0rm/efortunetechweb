/**
 * Contact-form validation helpers for the efortune.tech contact Worker.
 * Kept in a separate module so they can be unit-tested without wrangler.
 */

export const DOMAIN = 'efortune.tech';
export const EXPECTED_ACTION = 'contact';
/** Default when `env.ALLOWED_HOSTS` is unset (comma-separated hostnames, no scheme). */
export const DEFAULT_ALLOWED_HOSTS = 'efortune.tech,www.efortune.tech';
export const MAX_BODY_BYTES = 20_000;

/**
 * Parse ALLOWED_HOSTS (Wrangler var or test override). Hostnames only, lowercase.
 */
export function parseAllowedHosts(value) {
  const raw = String(value ?? DEFAULT_ALLOWED_HOSTS).trim();
  if (!raw) return parseAllowedHosts(DEFAULT_ALLOWED_HOSTS);
  const hosts = raw
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return hosts.length ? hosts : parseAllowedHosts(DEFAULT_ALLOWED_HOSTS);
}

export const EXPECTED_HOSTNAMES = parseAllowedHosts(DEFAULT_ALLOWED_HOSTS);

function productionOriginsForHosts(hosts) {
  return new Set(hosts.map((h) => `https://${h}`));
}
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ');

/**
 * Accept https origins whose host is in allowedHosts (from ALLOWED_HOSTS).
 * http://localhost and http://127.0.0.1 are allowed only when the
 * request itself is also local (wrangler dev with Cloudflare test keys).
 */
export function isAllowedOrigin(origin, requestUrl, allowedHosts = EXPECTED_HOSTNAMES) {
  if (!origin || origin === 'null') return false;
  let originUrl;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  const hosts = Array.isArray(allowedHosts) ? allowedHosts : parseAllowedHosts(allowedHosts);
  if (productionOriginsForHosts(hosts).has(originUrl.origin)) return true;

  if (!requestUrl) return false;
  let reqUrl;
  try {
    reqUrl = new URL(requestUrl);
  } catch {
    return false;
  }
  const isLocal = (host) => host === 'localhost' || host === '127.0.0.1';
  return (
    originUrl.protocol === 'http:' &&
    isLocal(originUrl.hostname) &&
    isLocal(reqUrl.hostname)
  );
}

/**
 * Prefer Origin. If it is missing or the string "null", fall back to the
 * Referer origin. Returns null when neither header can be used, so the
 * Worker can let the request through and rely on Turnstile.
 */
export function requestClientOrigin(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== 'null') return origin;
  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return referer;
  }
}

/** Remove ASCII control characters, including CR/LF, before they reach email. */
export function stripControls(value) {
  return String(value ?? '').replace(/[\x00-\x1f\x7f]/g, '');
}

/** Official Cloudflare Turnstile test secrets (server-side dummy keys). */
export const OFFICIAL_TEST_SECRETS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);

/** Email addresses may not contain whitespace, quotes, or ASCII controls. */
export const EMAIL_RE = /^[^\s@<>()",;:\x00-\x1f]+@[^\s@<>()",;:\x00-\x1f]+\.[A-Za-z]{2,}$/;

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SKIP_REDISPLAY = new Set(['website', 'cf-turnstile-response']);

/**
 * Re-render the contact page with an error banner and the visitor's typed
 * values, HTML-escaped. Used for visible 4xx/5xx form errors.
 */
export function renderContactFormError(html, { message, values = {}, title } = {}) {
  let out = String(html ?? '');
  if (title) {
    if (/<title>[^<]*<\/title>/i.test(out)) {
      out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    } else {
      out = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body>${out}</body></html>`;
    }
  }
  // Error pages are served at /api/contact, so relative href/src values would
  // resolve under /api/. A single root base keeps CSS, images, and links working.
  if (/<head\b[^>]*>/i.test(out) && !/<base\b/i.test(out)) {
    out = out.replace(/<head\b[^>]*>/i, (open) => `${open}\n  <base href="/">`);
  }
  const banner = `<p class="form-error" role="alert"><strong>Message not sent.</strong> ${escapeHtml(message)}</p>`;
  if (/<form\b[^>]*>/i.test(out)) {
    out = out.replace(/<form\b[^>]*>/i, (open) => `${open}\n${banner}\n`);
  } else {
    out = `${banner}${out}`;
  }
  for (const [name, raw] of Object.entries(values)) {
    if (SKIP_REDISPLAY.has(name) || raw == null || raw === '') continue;
    const esc = escapeHtml(raw);
    const nameRe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp(`<input\\b([^>]*\\sname=["']${nameRe}["'][^>]*)>`, 'i'),
      (_m, attrs) => {
        const cleaned = attrs.replace(/\svalue=("[^"]*"|'[^']*')/i, '');
        return `<input${cleaned} value="${esc}">`;
      },
    );
    out = out.replace(
      new RegExp(`<textarea\\b([^>]*\\sname=["']${nameRe}["'][^>]*)>[\\s\\S]*?</textarea>`, 'i'),
      (_m, attrs) => `<textarea${attrs}>${esc}</textarea>`,
    );
    out = out.replace(
      new RegExp(`<select\\b([^>]*\\sname=["']${nameRe}["'][^>]*)>([\\s\\S]*?)</select>`, 'i'),
      (_m, attrs, inner) => {
        const filled = inner.replace(/<option\b([^>]*)>([^<]*)<\/option>/gi, (om, oattrs, text) => {
          const cleaned = oattrs.replace(/\sselected\b/gi, '');
          const valueAttr = oattrs.match(/\bvalue=(["'])(.*?)\1/i);
          const optVal = valueAttr ? valueAttr[2] : text;
          const sel = (optVal === raw || text === raw) ? ' selected' : '';
          return `<option${cleaned}${sel}>${text}</option>`;
        });
        return `<select${attrs}>${filled}</select>`;
      },
    );
  }
  return out;
}


/**
 * Conservative gibberish detector aimed at random-letter spam
 * (letter salads with extreme vowel ratios). Short messages, normal
 * sentences, compound words, and non-Latin writing pass. Flagged
 * messages are still sent, with a subject tag.
 */
export function isGibberishMessage(text) {
  const msg = String(text ?? '').trim();
  if (msg.length < 20) return false;

  const words = msg.split(/\s+/).filter(Boolean);
  const lettersOf = (s) => s.match(/[A-Za-z]/g) || [];
  const vowelCount = (s) => (s.match(/[aeiouyAEIOUY]/g) || []).length;

  const letterCount = lettersOf(msg).length;
  const compact = msg.replace(/\s+/g, '');
  if (letterCount < 20) return false;
  if (letterCount / compact.length < 0.8) return false;

  if (words.length <= 2) {
    const blob = lettersOf(words.join('')).join('');
    if (blob.length >= 20) {
      const ratio = vowelCount(blob) / blob.length;
      if (ratio < 0.18 || ratio > 0.75) return true;
    }
  }
  return false;
}

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server-side Turnstile check. Fails closed on a missing secret, missing
 * token, HTTP/network/parse error, unsuccessful Siteverify response, or a
 * hostname/action mismatch.
 * Official test secrets return hostname "example.com" and omit action; those
 * hostname/action checks are skipped only when the secret is one of
 * Cloudflare's published test secrets.
 * Does not log the secret or the token.
 */
export async function verifyTurnstile({
  secret,
  token,
  remoteip,
  expectedAction = EXPECTED_ACTION,
  expectedHostnames = EXPECTED_HOSTNAMES,
  fetchImpl = fetch,
  timeoutMs = 5000,
} = {}) {
  if (!secret) return { ok: false, reason: 'missing_secret' };
  if (!token) return { ok: false, reason: 'missing_token' };
  try {
    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (remoteip) body.set('remoteip', remoteip);
    const res = await fetchImpl(SITEVERIFY, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, reason: 'siteverify_http' };
    let data;
    try {
      data = await res.json();
    } catch {
      return { ok: false, reason: 'siteverify_error' };
    }
    if (!data || data.success !== true) return { ok: false, reason: 'siteverify_failed' };

    // Official test secrets always return hostname "example.com" and omit
    // action. Skip those checks only when the secret itself is one of
    // Cloudflare's published test secrets.
    const officialTestSecret = OFFICIAL_TEST_SECRETS.has(secret);
    if (!officialTestSecret) {
      if (expectedAction && data.action !== expectedAction) {
        return { ok: false, reason: 'action_mismatch' };
      }
      if (expectedHostnames?.length && !expectedHostnames.includes(data.hostname)) {
        return { ok: false, reason: 'hostname_mismatch' };
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'siteverify_error' };
  }
}

/**
 * Enforce the 20 KB cap on the bytes actually read, not only Content-Length.
 * Throws an error with code PAYLOAD_TOO_LARGE when the body is too big.
 */
export async function readBoundedFormData(request, maxBytes = MAX_BODY_BYTES) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > maxBytes) {
    const err = new Error('payload too large');
    err.code = 'PAYLOAD_TOO_LARGE';
    throw err;
  }
  const buf = await request.arrayBuffer();
  if (buf.byteLength > maxBytes) {
    const err = new Error('payload too large');
    err.code = 'PAYLOAD_TOO_LARGE';
    throw err;
  }
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: buf,
  }).formData();
}
