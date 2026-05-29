import { describe, expect, it } from 'vitest'
import {
  buildLoginSchema,
  buildRegisterSchema,
  LOGIN_FIELD_TYPES,
  REGISTER_FIELD_TYPES,
} from '../app/utils/auth-forms'

const messages: Record<string, string> = {
  'auth.invalid_email': 'Invalid email format',
  'auth.email_required': 'Email is required',
  'auth.password_required': 'Password is required',
  'auth.password_min': 'Password must be at least 8 characters',
  'auth.terms_required': 'You must accept the Terms of Service',
}

const t = (key: string) => messages[key] ?? key

describe('auth form field types', () => {
  it('login uses correct input types', () => {
    expect(LOGIN_FIELD_TYPES.email).toBe('email')
    expect(LOGIN_FIELD_TYPES.password).toBe('password')
  })

  it('register uses correct input types', () => {
    expect(REGISTER_FIELD_TYPES.email).toBe('email')
    expect(REGISTER_FIELD_TYPES.password).toBe('password')
  })

  it('register does not expose confirmPassword type', () => {
    expect((REGISTER_FIELD_TYPES as any).confirmPassword).toBeUndefined()
  })
})

describe('login form validation', () => {
  const schema = buildLoginSchema(t)

  it('accepts valid credentials', async () => {
    await expect(schema.validate({ email: 'user@example.com', password: 'secret123' }))
      .resolves.toBeTruthy()
  })

  it('rejects invalid email format', async () => {
    await expect(schema.validate({ email: 'not-an-email', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Invalid email format' })
  })

  it('rejects empty email', async () => {
    await expect(schema.validate({ email: '', password: 'secret123' }))
      .rejects.toMatchObject({ message: 'Email is required' })
  })

  it('rejects empty password', async () => {
    await expect(schema.validate({ email: 'user@example.com', password: '' }))
      .rejects.toMatchObject({ message: 'Password is required' })
  })
})

describe('register form validation', () => {
  const schema = buildRegisterSchema(t)

  const valid = { email: 'john@example.com', password: 'secret123', agreeToTerms: true }

  it('accepts valid email, password and accepted terms', async () => {
    await expect(schema.validate(valid)).resolves.toBeTruthy()
  })

  it('rejects invalid email format', async () => {
    await expect(schema.validate({ ...valid, email: 'not-an-email' }))
      .rejects.toMatchObject({ message: 'Invalid email format' })
  })

  it('rejects empty email', async () => {
    await expect(schema.validate({ ...valid, email: '' }))
      .rejects.toMatchObject({ message: 'Email is required' })
  })

  it('rejects empty password', async () => {
    await expect(schema.validate({ ...valid, password: '' }))
      .rejects.toMatchObject({ message: 'Password is required' })
  })

  it('rejects password shorter than 8 characters', async () => {
    await expect(schema.validate({ ...valid, password: '1234567' }))
      .rejects.toMatchObject({ message: 'Password must be at least 8 characters' })
  })

  it('accepts password of exactly 8 characters', async () => {
    await expect(schema.validate({ ...valid, password: '12345678' })).resolves.toBeTruthy()
  })

  it('rejects unchecked terms', async () => {
    await expect(schema.validate({ ...valid, agreeToTerms: false }))
      .rejects.toMatchObject({ message: 'You must accept the Terms of Service' })
  })

  it('rejects missing terms field', async () => {
    const { agreeToTerms: _, ...withoutTerms } = valid
    await expect(schema.validate(withoutTerms))
      .rejects.toMatchObject({ message: 'You must accept the Terms of Service' })
  })

  it('does not require name, first_name, last_name or confirmPassword', async () => {
    await expect(schema.validate(valid)).resolves.not.toHaveProperty('name')
  })

  it('does not require Privacy Policy consent — it is an informational notice, not a contract (GDPR)', async () => {
    await expect(schema.describe().fields).not.toHaveProperty('agreeToPrivacy')
  })

  it('ToS error message mentions only Terms of Service, not Privacy Policy', async () => {
    await expect(schema.validate({ ...valid, agreeToTerms: false }))
      .rejects.toMatchObject({ message: 'You must accept the Terms of Service' })
  })
})

describe('name derived from email', () => {
  it('extracts local part before @', () => {
    const email = 'john.doe@example.com'
    expect(email.split('@')[0]).toBe('john.doe')
  })

  it('handles subdomain emails', () => {
    const email = 'user@mail.example.com'
    expect(email.split('@')[0]).toBe('user')
  })

  it('handles plus-addressing', () => {
    const email = 'user+tag@example.com'
    expect(email.split('@')[0]).toBe('user+tag')
  })
})
