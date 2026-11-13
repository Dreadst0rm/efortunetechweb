/**
 * Legacy digest.efortune.tech URL → efortune.tech path (no hostname in wrangler routes).
 */

export const DIGEST_LEGACY_HOST = 'digest.efortune.tech';

/** @param {string} pathname */
export function mapDigestLegacyPath(pathname) {
  const raw = pathname || '/';
  const trimmed = raw.replace(/\/+$/, '') || '/';

  if (trimmed === '/' || trimmed === '/about') return '/digest/';
  if (trimmed === '/rss.xml') return '/digest/rss.xml';
  if (trimmed === '/sitemap.xml') return '/sitemap.xml';

  const updatesMatch = /^\/updates\/(\d{4}-\d{2}-\d{2})\/?$/.exec(raw);
  if (updatesMatch) {
    return `/digest/updates/${updatesMatch[1]}/`;
  }

  if (raw.startsWith('/updates/')) {
    const tail = raw.slice('/updates/'.length).replace(/\/+$/, '');
    if (/^\d{4}-\d{2}-\d{2}$/.test(tail)) {
      return `/digest/updates/${tail}/`;
    }
  }

  return `/digest${raw.endsWith('/') ? raw : `${raw}/`}`;
}

/**
 * @param {URL} requestUrl
 * @param {string} siteOrigin e.g. https://efortune.tech
 */
export function digestLegacyRedirectUrl(requestUrl, siteOrigin = 'https://efortune.tech') {
  if (requestUrl.hostname !== DIGEST_LEGACY_HOST) return null;
  const targetPath = mapDigestLegacyPath(requestUrl.pathname);
  return new URL(targetPath, siteOrigin.replace(/\/$/, '')).toString();
}
