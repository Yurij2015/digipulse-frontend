import { describe, expect, it } from 'vitest'
import { resolveLocaleString } from '../app/utils/locale-field'

describe('resolveLocaleString', () => {
  it('returns plain string as-is', () => {
    expect(resolveLocaleString('Hello', 'en')).toBe('Hello')
  })

  it('picks locale from translation map', () => {
    const map = { en: 'A', uk: 'B', pl: 'C' }
    expect(resolveLocaleString(map, 'uk')).toBe('B')
    expect(resolveLocaleString(map, 'en')).toBe('A')
  })

  it('falls back to en then first value', () => {
    expect(resolveLocaleString({ uk: 'B', pl: 'C' }, 'en')).toBe('B')
  })

  it('does not stringify nested objects', () => {
    expect(resolveLocaleString({ en: { type: 'doc' } }, 'en')).toBe('')
  })
})
