const dismissCookies = {
  onBeforeLoad(win: Window) {
    win.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: false, marketing: false }))
  }
}

// ─── Landing page (/index) ────────────────────────────────────────────────

describe('Landing page', () => {
  beforeEach(() => cy.visit('/', dismissCookies))

  it('renders the hero section', () => {
    cy.get('h1').should('be.visible')
    cy.contains(/monitoring system/i).should('be.visible')
  })

  it('has Get Started button linking to register', () => {
    cy.contains('a', /get started/i).first().should('have.attr', 'href').and('include', 'register')
  })

  it('has Login navigation link', () => {
    cy.contains('a, button', /login/i).should('be.visible')
  })

  it('shows feature cards', () => {
    cy.contains(/60s frequency|instant alerts|advanced metrics/i).should('be.visible')
  })

  it('shows How it Works section', () => {
    cy.contains(/how it works/i).should('be.visible')
  })

  it('links to Privacy Policy', () => {
    cy.get('a[href*="/privacy"]').should('exist')
  })

  it('links to Terms of Service', () => {
    cy.get('a[href*="/terms"]').should('exist')
  })
})

// ─── Privacy Policy (/privacy) ────────────────────────────────────────────

describe('Privacy policy page', () => {
  beforeEach(() => cy.visit('/privacy', dismissCookies))

  it('renders with a visible heading', () => {
    cy.contains(/privacy/i).should('be.visible')
  })

  it('has a link back to home', () => {
    cy.get('a[href="/"]').should('exist')
  })
})

// ─── Terms of Service (/terms) ────────────────────────────────────────────

describe('Terms of service page', () => {
  beforeEach(() => cy.visit('/terms', dismissCookies))

  it('renders with a visible heading', () => {
    cy.contains(/terms/i).should('be.visible')
  })

  it('has a link back to home', () => {
    cy.get('a[href="/"]').should('exist')
  })
})

// ─── Knowledge Base (/knowledge-base) ────────────────────────────────────

describe('Knowledge base index', () => {
  beforeEach(() => cy.visit('/knowledge-base', dismissCookies))

  it('renders a heading', () => {
    cy.get('h1, h2').first().should('be.visible')
  })
})

// ─── Forgot Password (/auth/forgot-password) ──────────────────────────────

describe('Forgot password page', () => {
  function typeAndBlur(selector: string, value: string) {
    cy.get(selector).focus().type(value).blur()
  }

  function waitForHydration(selector = 'input[name="email"]') {
    cy.get(selector, { timeout: 30000 }).should($el => {
      const hasVei = Object.getOwnPropertySymbols($el[0]).some(s => s.toString() === 'Symbol(_vei)')
      expect(hasVei, 'Vue hydration complete').to.be.true
    })
  }

  beforeEach(() => {
    cy.visit('/auth/forgot-password', dismissCookies)
    waitForHydration()
  })

  it('renders the email form', () => {
    cy.get('input[name="email"]').should('exist')
  })

  it('has Reset Password heading', () => {
    cy.contains(/reset password/i).should('be.visible')
  })

  it('has link back to login', () => {
    cy.get('a[href*="/auth/login"]').should('exist')
  })

  it('has Send Reset Link button', () => {
    cy.contains('button', /send reset link/i).should('be.visible')
  })

  it('shows email required error on empty blur', () => {
    cy.get('input[name="email"]').focus().blur()
    cy.contains(/email is required/i).should('be.visible')
  })

  it('shows invalid email error', () => {
    typeAndBlur('input[name="email"]', 'bad-email')
    cy.contains(/invalid email/i).should('be.visible')
  })
})

// ─── Reset password page (/auth/reset-password) ───────────────────────────

describe('Reset password page', () => {
  function typeAndBlur(selector: string, value: string) {
    cy.get(selector).focus().type(value).blur()
  }

  function waitForHydration(selector = 'input[name="password"]') {
    cy.get(selector, { timeout: 30000 }).should($el => {
      const hasVei = Object.getOwnPropertySymbols($el[0]).some(s => s.toString() === 'Symbol(_vei)')
      expect(hasVei, 'Vue hydration complete').to.be.true
    })
  }

  beforeEach(() => {
    cy.visit('/auth/reset-password', dismissCookies)
    waitForHydration()
  })

  it('renders the password and confirmation fields', () => {
    cy.get('input[name="password"]').should('exist')
    cy.get('input[name="password_confirmation"]').should('exist')
  })

  it('has correct input types', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    cy.get('input[name="password_confirmation"]').should('have.attr', 'type', 'password')
  })

  it('has New Password heading', () => {
    cy.contains(/new password/i).should('be.visible')
  })

  it('has Update Password button', () => {
    cy.contains('button', /update password/i).should('be.visible')
  })

  it('has link back to home', () => {
    cy.get('a[href="/"]').should('exist')
  })

  it('shows validation error on empty password blur', () => {
    // min(6) error fires before required for empty string in Yup chain
    cy.get('input[name="password"]').focus().blur()
    cy.get('[data-slot="error"]').first().should('be.visible')
  })

  it('shows password too short error', () => {
    typeAndBlur('input[name="password"]', '12345')
    cy.contains(/at least/i).should('be.visible')
  })

  it('shows password mismatch error', () => {
    typeAndBlur('input[name="password"]', 'password123')
    typeAndBlur('input[name="password_confirmation"]', 'different123')
    cy.contains(/do not match/i).should('be.visible')
  })
})

// ─── Verify email page (/auth/verify-email) ───────────────────────────────

describe('Verify email page', () => {
  beforeEach(() => cy.visit('/auth/verify-email', dismissCookies))

  it('loads without redirect', () => {
    cy.location('pathname').should('include', '/auth/verify-email')
  })

  it('renders a heading', () => {
    cy.contains(/verify email/i).should('be.visible')
  })
})

// ─── B2B landing page (/b2b-site-monitoring) ─────────────────────────────

describe('B2B site monitoring page', () => {
  beforeEach(() => cy.visit('/b2b-site-monitoring', dismissCookies))

  it('loads without redirect', () => {
    cy.location('pathname').should('include', 'b2b-site-monitoring')
  })

  it('renders a visible heading', () => {
    cy.get('h1, h2').first().should('be.visible')
  })
})