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
  'auth.username_required': 'Username is required',
  'auth.first_name_required': 'First Name is required',
  'auth.last_name_required': 'Last Name is required',
  'auth.password_min': 'Password must be at least 6 characters',
  'auth.passwords_mismatch': 'Passwords do not match',
}

const t = (key: string) => messages[key] ?? key

describe('auth form field types', () => {
  it('uses correct login input types', () => {
    expect(LOGIN_FIELD_TYPES.email).toBe('email')
    expect(LOGIN_FIELD_TYPES.password).toBe('password')
  })

  it('uses correct register input types', () => {
    expect(REGISTER_FIELD_TYPES.email).toBe('email')
    expect(REGISTER_FIELD_TYPES.password).toBe('password')
    expect(REGISTER_FIELD_TYPES.confirmPassword).toBe('password')
  })
})

describe('login form validation', () => {
  const schema = buildLoginSchema(t)

  it('accepts valid payload', async () => {
    await expect(schema.validate({
      email: 'user@example.com',
      password: 'secret123',
    })).resolves.toBeTruthy()
  })

  it('shows invalid email error', async () => {
    await expect(schema.validate({
      email: 'not-email',
      password: 'secret123',
    })).rejects.toMatchObject({ message: 'Invalid email format' })
  })

  it('shows required password error', async () => {
    await expect(schema.validate({
      email: 'user@example.com',
      password: '',
    })).rejects.toMatchObject({ message: 'Password is required' })
  })
})

describe('register form validation', () => {
  const schema = buildRegisterSchema(t)

  it('accepts valid payload', async () => {
    await expect(schema.validate({
      name: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    })).resolves.toBeTruthy()
  })

  it('shows required name error', async () => {
    await expect(schema.validate({
      name: '',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    })).rejects.toMatchObject({ message: 'Username is required' })
  })

  it('shows minimum password length error', async () => {
    await expect(schema.validate({
      name: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: '12345',
      confirmPassword: '12345',
    })).rejects.toMatchObject({ message: 'Password must be at least 6 characters' })
  })

  it('shows password mismatch error', async () => {
    await expect(schema.validate({
      name: 'john',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      confirmPassword: 'different123',
    })).rejects.toMatchObject({ message: 'Passwords do not match' })
  })
})

