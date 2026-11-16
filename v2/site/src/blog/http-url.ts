/**
 * True for absolute http and https URLs.
 * `javascript:` and `data:` parse as URLs but are not allowed as source hrefs.
 */
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '' || value !== value.trim()) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
