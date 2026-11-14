/**
 * Per-response CSP nonces for HTML (Cloudflare JS Detections + first-party scripts).
 * @see https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/
 */

/** @returns {string} CSP nonce value (no nonce- prefix). */
export function generateCspNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Strict CSP for static `_headers` fallback (Worker overwrites on HTML when it runs).
 * No `unsafe-inline` in script-src — external scripts only until nonces apply.
 */
/** Headers mirrored from `public/_headers` for HTML when the User Worker serves first. */
export const HTML_SECURITY_HEADERS = Object.freeze({
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'strict-transport-security': 'max-age=31536000',
});

export function applyHtmlSecurityHeaders(headers) {
  for (const [key, value] of Object.entries(HTML_SECURITY_HEADERS)) {
    headers.set(key, value);
  }
}

export const STATIC_FALLBACK_CONTENT_SECURITY_POLICY = [
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
 * Build CSP for HTML responses. Requires a nonce in script-src (no unsafe-inline).
 * Same-origin `/cdn-cgi/challenge-platform/` is covered by `'self'`.
 *
 * @param {string} nonce
 */
export function buildContentSecurityPolicy(nonce) {
  if (!nonce || typeof nonce !== 'string') {
    throw new Error('CSP nonce is required');
  }
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    "frame-src https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ');
}

/**
 * @param {string} html
 * @param {string} nonce
 */
export function addNonceToScriptOpenTags(html, nonce) {
  return html.replace(/<script(\s[^>]*)?>/gi, (match, rest = '') => {
    if (/\bnonce\s*=/.test(match)) return match;
    return `<script nonce="${nonce}"${rest}>`;
  });
}

/**
 * @param {Response} response
 */
export function isHtmlResponse(response) {
  const ct = (response.headers.get('content-type') || '').toLowerCase();
  return ct.includes('text/html');
}

/**
 * Set CSP with nonce on the response and add the same nonce to every &lt;script&gt; tag.
 *
 * @param {Response} response
 * @param {string} nonce
 * @returns {Response}
 */
export function applyHtmlNonceTransform(response, nonce) {
  const headers = new Headers(response.headers);
  headers.delete('content-security-policy');
  headers.set('content-security-policy', buildContentSecurityPolicy(nonce));
  headers.set('cache-control', 'private, no-cache');
  applyHtmlSecurityHeaders(headers);

  if (typeof HTMLRewriter === 'undefined') {
    throw new Error('HTMLRewriter is required to apply CSP nonces to HTML responses');
  }

  const rewriter = new HTMLRewriter().on('script', {
    element(el) {
      el.setAttribute('nonce', nonce);
    },
  });
  return rewriter.transform(
    new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }),
  );
}

/**
 * HTML response with fresh nonce + script tags rewritten (buffered HTML).
 *
 * @param {string} html
 * @param {number} [status]
 * @param {Record<string, string>} [extraHeaders]
 */
export function htmlSecurityResponse(html, status = 200, extraHeaders = {}) {
  const nonce = generateCspNonce();
  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'private, no-cache',
    ...extraHeaders,
    'content-security-policy': buildContentSecurityPolicy(nonce),
  });
  applyHtmlSecurityHeaders(headers);
  const body = addNonceToScriptOpenTags(html, nonce);
  return new Response(body, { status, headers });
}