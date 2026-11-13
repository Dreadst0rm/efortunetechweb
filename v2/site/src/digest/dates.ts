const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function isRealIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const match = ISO_DATE.exec(value)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function formatDisplayDate(isoDate: string): string {
  if (!isRealIsoDate(isoDate)) {
    throw new Error(`Invalid calendar date: ${JSON.stringify(isoDate)}`)
  }
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function digestUpdatePath(date: string): string {
  return `/digest/updates/${date}/`
}
