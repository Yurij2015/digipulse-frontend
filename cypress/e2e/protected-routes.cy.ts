// Tests that verify protected routes redirect unauthenticated users to the
// home page, and that authenticated users are blocked from guest-only routes.

const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/sites',
  '/add-website',
  '/support',
]

const GUEST_ONLY_ROUTES = [
  '/auth/login',
  '/auth/register',
]

describe('Protected routes — unauthenticated access', () => {
  beforeEach(() => {
    // Ensure no auth token is present
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  PROTECTED_ROUTES.forEach(route => {
    it(`redirects ${route} to home when not logged in`, () => {
      cy.visit(route)
      // auth middleware redirects to '/'
      cy.location('pathname').should('eq', '/')
    })
  })

  it('redirects /sites/1/history to home when not logged in', () => {
    cy.visit('/sites/1/history')
    cy.location('pathname').should('eq', '/')
  })

  it('redirects /sites/1/edit to home when not logged in', () => {
    cy.visit('/sites/1/edit')
    cy.location('pathname').should('eq', '/')
  })
})

describe('Public auth pages — basic accessibility', () => {
  GUEST_ONLY_ROUTES.forEach(route => {
    it(`${route} is accessible when not logged in`, () => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.visit(route)
      cy.location('pathname').should('include', route)
    })
  })
})

describe('Public pages — accessible without auth', () => {
  const PUBLIC_ROUTES = ['/', '/privacy', '/terms', '/knowledge-base']

  PUBLIC_ROUTES.forEach(route => {
    it(`${route} loads without redirect`, () => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.visit(route)
      cy.location('pathname').should('include', route === '/' ? '/' : route)
    })
  })
})

describe('Guest-only routes — redirect authenticated users', () => {
  // useAuth uses useCookie('auth-token') as the source of truth
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    // Set auth-token cookie before visiting so guest middleware sees it
    cy.setCookie('auth-token', 'fake-token', { path: '/', sameSite: 'lax' })
  })

  GUEST_ONLY_ROUTES.forEach(route => {
    it(`${route} redirects authenticated users away from auth pages`, () => {
      cy.visit(route)
      cy.location('pathname').should('not.include', '/auth/')
    })
  })
})

describe('Login error query params', () => {
  it('shows error alert when ?error=auth_failed is in URL', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit('/auth/login?error=auth_failed', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: false, choice: 'essential_only', version: 6, ts: new Date().toISOString() }))
      }
    })
    cy.contains(/authentication failed/i).should('be.visible')
  })

  it('login page renders cleanly without error query param', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit('/auth/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: false, choice: 'essential_only', version: 6, ts: new Date().toISOString() }))
      }
    })
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })
})