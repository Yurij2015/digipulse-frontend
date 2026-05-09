import { object, ref as yupRef, string } from 'yup'

type TranslateFn = (key: string) => string

export const LOGIN_FIELD_TYPES = {
  email: 'email',
  password: 'password',
} as const

export const REGISTER_FIELD_TYPES = {
  email: 'email',
  password: 'password',
  confirmPassword: 'password',
} as const

export const buildLoginSchema = (t: TranslateFn) =>
  object({
    email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
    password: string().required(t('auth.password_required')),
  })

export const buildRegisterSchema = (t: TranslateFn) =>
  object({
    email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
    name: string().required(t('auth.username_required')),
    first_name: string().required(t('auth.first_name_required')),
    last_name: string().required(t('auth.last_name_required')),
    password: string().min(6, t('auth.password_min')).required(t('auth.password_required')),
    confirmPassword: string().oneOf([yupRef('password')], t('auth.passwords_mismatch')).required(t('auth.passwords_mismatch')),
  })

