import { describe, expect, it } from 'vitest'
import { resolveAuthApiError, resolveAuthQueryError } from '../app/utils/auth-api-errors'

const messages: Record<string, string> = {
  'auth.email_required': 'Email is required',
  'auth.invalid_email': 'Invalid email format',
  'auth.password_required': 'Password is required',
  'auth.errors.auth_failed': 'Authentication failed. Please contact support.',
  'auth.errors.no_token': 'Token not found. Please try logging in again.',
  'auth.api_errors.invalid_credentials': 'Invalid email or password.',
  'auth.api_errors.email_taken': 'This email is already registered.',
  'auth.api_errors.password_min_server': 'Password must be at least 10 characters.',
  'auth.api_errors.turnstile_missing': 'Security check failed. Please refresh the page and try again.',
  'auth.api_errors.too_many_attempts': 'Too many attempts. Please wait a moment and try again.',
  'auth.api_errors.generic': 'Something went wrong. Please try again.',
}

const t = (key: string) => messages[key] ?? key
const te = (key: string) => key in messages

describe('resolveAuthApiError', () => {
  it('translates invalid credentials message', () => {
    expect(resolveAuthApiError({ data: { message: 'Invalid credentials' } }, t))
      .toBe('Invalid email or password.')
  })

  it('translates first Laravel validation error', () => {
    expect(resolveAuthApiError({
      data: {
        errors: {
          email: ['The email field is required.'],
        },
      },
    }, t)).toBe('Email is required')
  })

  it('translates duplicate email validation error', () => {
    expect(resolveAuthApiError({
      data: {
        errors: {
          email: ['The email has already been taken.'],
        },
      },
    }, t)).toBe('This email is already registered.')
  })

  it('translates password min length validation error', () => {
    expect(resolveAuthApiError({
      data: {
        errors: {
          password: ['The password field must be at least 10 characters.'],
        },
      },
    }, t)).toBe('Password must be at least 10 characters.')
  })

  it('translates turnstile error payload', () => {
    expect(resolveAuthApiError({ data: { error: 'Missing Turnstile token.' } }, t))
      .toBe('Security check failed. Please refresh the page and try again.')
  })

  it('falls back to generic message for unknown API errors', () => {
    expect(resolveAuthApiError({ data: { message: 'Unexpected server failure' } }, t))
      .toBe('Something went wrong. Please try again.')
  })

  it('translates rate limit by status code', () => {
    expect(resolveAuthApiError({ status: 429 }, t))
      .toBe('Too many attempts. Please wait a moment and try again.')
  })
})

describe('resolveAuthQueryError', () => {
  it('returns null when query error is missing', () => {
    expect(resolveAuthQueryError(null, t, te)).toBeNull()
  })

  it('translates known query error keys', () => {
    expect(resolveAuthQueryError('no_token', t, te)).toBe('Token not found. Please try logging in again.')
  })

  it('falls back to auth_failed for unknown query error keys', () => {
    expect(resolveAuthQueryError('unknown_error', t, te)).toBe('Authentication failed. Please contact support.')
  })
})
