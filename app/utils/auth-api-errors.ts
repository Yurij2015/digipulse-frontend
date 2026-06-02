type TranslateFn = (key: string) => string;

export type AuthApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

const EXACT_MESSAGE_KEYS: Record<string, string> = {
  'Invalid credentials': 'auth.api_errors.invalid_credentials',
  'The email has already been taken.': 'auth.api_errors.email_taken',
  'This username is already taken.': 'auth.api_errors.username_taken',
  'Username can only contain Latin letters, numbers, dots, dashes, and underscores.': 'auth.api_errors.username_format',
  'The password field confirmation does not match.': 'auth.api_errors.password_confirmation',
  'The password field must contain at least one letter.': 'auth.api_errors.password_letters',
  'The password field must contain at least one number.': 'auth.api_errors.password_numbers',
  'The password field must contain at least 6 unique characters.': 'auth.api_errors.password_unique_chars',
  'The password must contain at least 6 unique characters.': 'auth.api_errors.password_unique_chars',
  'Missing Turnstile token.': 'auth.api_errors.turnstile_missing',
  'Turnstile verification failed.': 'auth.api_errors.turnstile_failed',
  'Turnstile verification request failed. Please try again later.': 'auth.api_errors.turnstile_unavailable',
  'Too Many Attempts.': 'auth.api_errors.too_many_attempts',
};

const MESSAGE_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /^The email field is required\.$/, key: 'auth.email_required' },
  { pattern: /^The email field must be a valid email address\.$/, key: 'auth.invalid_email' },
  { pattern: /^The password field is required\.$/, key: 'auth.password_required' },
  { pattern: /^The password field must be at least \d+ characters\.$/, key: 'auth.api_errors.password_min_server' },
];

function translateKnownApiMessage(message: string, t: TranslateFn): string | null {
  const exactKey = EXACT_MESSAGE_KEYS[message];
  if (exactKey) {
    return t(exactKey);
  }

  for (const { pattern, key } of MESSAGE_PATTERNS) {
    if (pattern.test(message)) {
      return t(key);
    }
  }

  return null;
}

function firstValidationMessage(errors: Record<string, string[]>): string | null {
  for (const messages of Object.values(errors)) {
    const first = messages?.[0];
    if (first) return first;
  }

  return null;
}

export function resolveAuthApiError(
  error: { data?: AuthApiErrorPayload; status?: number } | null | undefined,
  t: TranslateFn,
): string {
  const data = error?.data;

  if (data?.errors) {
    const message = firstValidationMessage(data.errors);
    if (message) {
      const translated = translateKnownApiMessage(message, t);
      if (translated) return translated;
    }
  }

  if (data?.message) {
    const translated = translateKnownApiMessage(data.message, t);
    if (translated) return translated;
  }

  if (data?.error) {
    const translated = translateKnownApiMessage(data.error, t);
    if (translated) return translated;
  }

  if (error?.status === 429) {
    return t('auth.api_errors.too_many_attempts');
  }

  return t('auth.api_errors.generic');
}

const VALID_ERROR_CODE = /^[a-z0-9_]{1,64}$/;

export function resolveAuthQueryError(error: string | null | undefined, t: TranslateFn, te: (key: string) => boolean): string | null {
  if (!error) return null;
  if (!VALID_ERROR_CODE.test(error)) return null;

  const key = `auth.errors.${error}`;
  return te(key) ? t(key) : t('auth.errors.auth_failed');
}
