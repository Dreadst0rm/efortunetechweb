/**
 * Map legacy Digest URLs (on-site /digest/* and digest.efortune.tech) to /blog/* on efortune.tech.
 */

export const EFORTUNE_ORIGIN = 'https://efortune.tech';
export const DIGEST_HOST = 'digest.efortune.tech';

/** @param {string} pathname */
export function mapLegacyDigestPathToBlog(pathname) {
  const raw = pathname || '/';
  if (raw === '/digest' || raw === '/digest/') {
    return '/blog/';
  }
  if (raw === '/digest/rss.xml') {
    return '/blog/rss.xml';
  }

  const updatesMatch = /^\/digest\/updates\/(\d{4}-\d{2}-\d{2})\/?$/.exec(raw);
  if (updatesMatch) {
    return `/blog/updates/${updatesMatch[1]}/`;
  }

  if (raw.startsWith('/digest/')) {
    const tail = raw.slice('/digest'.length) || '/';
    const normalized = tail.startsWith('/') ? tail : `/${tail}`;
    return `/blog${normalized.replace(/\/$/, '')}/`;
  }

  return null;
}

/**
 * Map paths as served on digest.efortune.tech to blog paths on efortune.tech.
 * @param {string} pathname
 */
export function mapDigestHostPathToBlog(pathname) {
  const raw = pathname || '/';
  if (raw === '/' || raw === '') {
    return '/blog/';
  }
  if (raw === '/rss.xml') {
    return '/blog/rss.xml';
  }
  if (raw === '/about' || raw === '/about/') {
    return '/about.html';
  }

  const updatesMatch = /^\/updates\/(\d{4}-\d{2}-\d{2})\/?$/.exec(raw);
  if (updatesMatch) {
    return `/blog/updates/${updatesMatch[1]}/`;
  }

  if (raw.startsWith('/updates/')) {
    return null;
  }

  return null;
}

/**
 * @param {URL} requestUrl
 * @returns {string | null} absolute redirect target
 */
export function digestOffsiteRedirectUrl(requestUrl) {
  let target = null;

  if (requestUrl.hostname === DIGEST_HOST) {
    const mapped = mapDigestHostPathToBlog(requestUrl.pathname);
    if (mapped) target = `${EFORTUNE_ORIGIN}${mapped}`;
  } else {
    const mapped = mapLegacyDigestPathToBlog(requestUrl.pathname);
    if (mapped) target = new URL(mapped, requestUrl.origin).toString();
  }

  if (!target) return null;
  if (!requestUrl.search) return target;
  return `${target}${requestUrl.search}`;
}