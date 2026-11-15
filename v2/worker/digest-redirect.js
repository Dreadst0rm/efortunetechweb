/**
 * Redirect stale on-site /digest/* URLs to the live Digest at digest.efortune.tech.
 */

export const DIGEST_ORIGIN = 'https://digest.efortune.tech';

/** @param {string} pathname */
export function mapOnsiteDigestPath(pathname) {
  const raw = pathname || '/';
  if (raw === '/digest' || raw === '/digest/') {
    return `${DIGEST_ORIGIN}/`;
  }
  if (raw === '/digest/rss.xml') {
    return `${DIGEST_ORIGIN}/rss.xml`;
  }

  const updatesMatch = /^\/digest\/updates\/(\d{4}-\d{2}-\d{2})\/?$/.exec(raw);
  if (updatesMatch) {
    return `${DIGEST_ORIGIN}/updates/${updatesMatch[1]}/`;
  }

  if (raw.startsWith('/digest/')) {
    const tail = raw.slice('/digest'.length) || '/';
    const normalized = tail.startsWith('/') ? tail : `/${tail}`;
    return new URL(normalized, DIGEST_ORIGIN).toString();
  }

  return null;
}

/**
 * @param {URL} requestUrl
 * @returns {string | null}
 */
export function digestOffsiteRedirectUrl(requestUrl) {
  const target = mapOnsiteDigestPath(requestUrl.pathname);
  if (!target) return null;
  if (!requestUrl.search) return target;
  return `${target}${requestUrl.search}`;
}