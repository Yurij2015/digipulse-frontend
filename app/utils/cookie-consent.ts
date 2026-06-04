export const COOKIE_CONSENT_STORAGE_KEY = 'cookie_consent_v2'
export const COOKIE_CONSENT_DISMISS_SESSION_KEY = 'cookie_consent_dismissed_session'
export const COOKIE_CONSENT_VERSION = 6

export type CookieConsentChoice = 'reject_all' | 'essential_only' | 'accept_all'

export type CookieConsentRecord = {
  analytics: boolean
  choice: CookieConsentChoice
  version: number
  ts: string
}

function normalizeChoice(choice: string | undefined, analytics: boolean): CookieConsentChoice {
  if (choice === 'reject_all' || choice === 'essential_only' || choice === 'accept_all') {
    return choice
  }
  return analytics ? 'accept_all' : 'essential_only'
}

export function parseCookieConsent(raw: string | null): CookieConsentRecord | null {
  if (!raw) return null
  try {
    const saved = JSON.parse(raw) as {
      analytics?: boolean
      choice?: string
      version?: number
      ts?: string
    }
    const choice = normalizeChoice(saved.choice, !!saved.analytics)
    return {
      analytics: choice === 'accept_all',
      choice,
      version: saved.version ?? 1,
      ts: typeof saved.ts === 'string' ? saved.ts : new Date(0).toISOString(),
    }
  } catch {
    return null
  }
}

export function buildCookieConsentRecord(choice: CookieConsentChoice): CookieConsentRecord {
  return {
    analytics: choice === 'accept_all',
    choice,
    version: COOKIE_CONSENT_VERSION,
    ts: new Date().toISOString(),
  }
}

export function consentStatusFromChoice(choice: CookieConsentChoice): 'denied' | 'essential' | 'granted' {
  if (choice === 'accept_all') return 'granted'
  if (choice === 'reject_all') return 'denied'
  return 'essential'
}
