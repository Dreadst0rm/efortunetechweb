const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

/** @param {unknown} value */
export function isQuickCheckHostname(value) {
  if (typeof value !== 'string') return false;
  const host = value.trim().toLowerCase().replace(/\.$/, '');
  if (!host || host.length > 253) return false;
  if (host === 'localhost' || host.endsWith('.localhost')) return false;
  if (host.includes(':') || host.includes('/')) return false;

  // Block IPv4 / IPv6 literals
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  if (host.includes('::') || /^\[/.test(host)) return false;

  const labels = host.split('.');
  if (labels.length < 2) return false;
  return labels.every((l) => LABEL.test(l));
}
