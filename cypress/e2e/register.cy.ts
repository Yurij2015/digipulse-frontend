describe('Registration form', () => {
  function typeAndBlur(selector: string, value: string) {
    cy.get(selector).focus().type(value).blur()
  }

  function waitForHydration(selector = 'input[name="email"]') {
    cy.get(selector, { timeout: 30000 }).should($el => {
      const hasVei = Object.getOwnPropertySymbols($el[0]).some(s => s.toString() === 'Symbol(_vei)')
      expect(hasVei, 'Vue hydration complete').to.be.true
    })
  }

  // Click the visible Reka UI CheckboxRoot button instead of the hidden native
  // <input>, which is covered by the UCard body div.
  function checkCheckbox(name: string) {
    cy.get(`input[name="${name}"]`).closest('[data-slot="base"]').click({ force: true })
  }

  beforeEach(() => {
    cy.visit('/auth/register', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: false, marketing: false }))
      }
    })
    waitForHydration()
  })

  // ─── Layout ───────────────────────────────────────────────────────────────

  it('renders only email and password fields', () => {
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('input[name="name"]').should('not.exist')
    cy.get('input[name="first_name"]').should('not.exist')
    cy.get('input[name="last_name"]').should('not.exist')
    cy.get('input[name="confirmPassword"]').should('not.exist')
  })

  it('has correct input types', () => {
    cy.get('input[name="email"]').should('have.attr', 'type', 'email')
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  it('shows Google sign-up button', () => {
    cy.contains('button, a', /google/i).should('be.visible')
  })

  it('has link to login page', () => {
    cy.get('a[href*="/auth/login"]').should('exist')
  })

  // ─── Terms of Service ─────────────────────────────────────────────────────

  it('has ToS checkbox unchecked by default', () => {
    cy.get('input[name="agreeToTerms"]').should('exist').and('not.be.checked')
  })

  it('has link to /terms', () => {
    cy.get('a[href*="/terms"]').should('be.visible')
  })

  it('shows Privacy Policy as informational text with link, not checkbox', () => {
    cy.get('a[href*="/privacy"]').should('exist')
    cy.get('input[name="agreeToPrivacy"]').should('not.exist')
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

  it('shows password too short error', () => {
    typeAndBlur('input[name="password"]', '1234567')
    cy.contains(/at least 8/i).should('be.visible')
  })

  it('shows ToS required error via UForm error state', () => {
    // Fill valid email+password, then trigger agreeToTerms validation by
    // checking and immediately unchecking to mark it dirty.
    typeAndBlur('input[name="email"]', 'user@example.com')
    typeAndBlur('input[name="password"]', 'validpass123')
    checkCheckbox('agreeToTerms')   // check → true → valid
    checkCheckbox('agreeToTerms')   // uncheck → false → invalid → triggers error
    cy.get('[data-slot="error"]').should('contain.text', 'Terms of Service')
  })

  it('does not mention Privacy Policy in validation errors', () => {
    typeAndBlur('input[name="email"]', 'not-an-email')
    cy.get('[data-slot="error"]').each($el => {
      cy.wrap($el).should('not.contain.text', /privacy policy/i)
    })
  })

  // ─── Happy path ───────────────────────────────────────────────────────────

  it('submit button is not disabled by default', () => {
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('ToS checkbox can be checked', () => {
    checkCheckbox('agreeToTerms')
    cy.get('input[name="agreeToTerms"]').should('be.checked')
  })
})