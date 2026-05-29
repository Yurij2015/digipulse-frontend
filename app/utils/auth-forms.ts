import { boolean, object, ref as yupRef, string } from 'yup'

type TranslateFn = (key: string) => string

export const LOGIN_FIELD_TYPES = {
  email: 'email',
  password: 'password',
} as const

export const REGISTER_FIELD_TYPES = {
  email: 'email',
  password: 'password',
} as const

export const buildLoginSchema = (t: TranslateFn) =>
  object({
    email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
    password: string().required(t('auth.password_required')),
  })

export const buildRegisterSchema = (t: TranslateFn) =>
  object({
    email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
    password: string().required(t('auth.password_required')).min(8, t('auth.password_min')),
    agreeToTerms: boolean().oneOf([true], t('auth.terms_required')).required(t('auth.terms_required')), // ToS only — Privacy Policy is an informational notice, not a consent requirement (GDPR)
  })

