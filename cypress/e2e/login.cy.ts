describe('Login form', () => {
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
    cy.visit('/auth/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: false, choice: 'essential_only', version: 6, ts: new Date().toISOString() }))
      }
    })
    waitForHydration()
  })

  // ─── Layout ───────────────────────────────────────────────────────────────

  it('renders email and password fields', () => {
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })

  it('has correct input types', () => {
    cy.get('input[name="email"]').should('have.attr', 'type', 'email')
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  it('shows Google sign-in button', () => {
    cy.contains('button, a', /google/i).should('be.visible')
  })

  it('has link to register page', () => {
    cy.get('a[href*="/auth/register"]').should('exist')
  })

  it('has forgot password link', () => {
    cy.get('a[href*="/auth/forgot-password"]').should('exist')
  })

  it('submit button is not disabled by default', () => {
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  // ─── Field-level validation (blur-triggered) ──────────────────────────────

  it('shows email required error on empty blur', () => {
    cy.get('input[name="email"]').focus().blur()
    cy.contains(/email is required/i).should('be.visible')
  })

  it('shows invalid email error', () => {
    typeAndBlur('input[name="email"]', 'not-an-email')
    cy.contains(/invalid email/i).should('be.visible')
  })

  it('shows password required error on empty blur', () => {
    cy.get('input[name="password"]').focus().blur()
    cy.contains(/password is required/i).should('be.visible')
  })
})