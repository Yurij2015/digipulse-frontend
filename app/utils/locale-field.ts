/**
 * Pick a single localized string from API fields (plain string or { en, uk, pl, ... }).
 * Never returns nested objects (avoids "[object Object]" in templates).
 */
export function resolveLocaleString(field: unknown, localeCode: string): string {
  if (field == null || field === '') {
    return ''
  }
  if (typeof field === 'string') {
    return field
  }
  if (typeof field !== 'object') {
    return String(field)
  }
  const rec = field as Record<string, unknown>
  const v = rec[localeCode] ?? rec.en ?? Object.values(rec)[0]
  if (v == null) {
    return ''
  }
  if (typeof v === 'string') {
    return v
  }
  if (typeof v === 'number' || typeof v === 'boolean') {
    return String(v)
  }
  return ''
}
