import { expect, test } from '@playwright/test'

test.describe('UI/UX and Localization', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie_consent_v2', JSON.stringify({ analytics: true, choice: 'accept_all', version: 6, ts: new Date().toISOString() }))
    })

    await context.addCookies([
      { name: 'auth-token', value: 'fake-token', url: 'http://127.0.0.1:3000' },
      { name: 'auth-user', value: encodeURIComponent(JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com', is_verified: true })), url: 'http://127.0.0.1:3000' }
    ])
    await page.route('**/api/v1/me', async route => {
      await route.fulfill({ json: { user: { id: 1, name: 'Test User', email: 'test@example.com', is_verified: true } } })
    })
    await page.route('**/api/v1/sites*', async route => {
      await route.fulfill({ json: { data: [], meta: { total: 0 } } })
    })
    await page.route('**/api/v1/sites/status-counts', async route => {
      await route.fulfill({ json: { total: 0, online: 0, offline: 0, slow: 0 } })
    })
  })

  test('Theme Switching changes HTML class', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    // Click the visible theme switcher button in the sidebar
    const themeBtn = page.locator('aside button[aria-label="Theme"]')
    
    // Initially could be light or dark depending on system preference
    // Clicking should toggle dark class on html
    const html = page.locator('html')
    
    // Wait for initial color-mode to settle
    await page.waitForTimeout(1000)
    
    const initialIsDark = await html.evaluate(el => el.classList.contains('dark'))
    
    await themeBtn.click()
    
    if (initialIsDark) {
      await expect(html).not.toHaveClass(/dark/)
    } else {
      await expect(html).toHaveClass(/dark/)
    }
  })

  test('Language Switcher shows available locales', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    
    // The language switcher displays the current locale, e.g. "EN"
    // Find the button that contains text matching a locale (usually uppercase 'EN', 'UK', 'PL')
    const langBtn = page.locator('aside button').filter({ hasText: /^(en|uk|pl)$/i }).first()
    await langBtn.click()
    
    // Check if dropdown shows EN, UK, PL
    await expect(page.locator('text=English').first()).toBeVisible()
    await expect(page.locator('text=Українська').first()).toBeVisible()
    await expect(page.locator('text=Polski').first()).toBeVisible()
  })

  test('Responsiveness: Mobile sidebar burger menu appears on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/dashboard')
    
    // Burger menu should be visible in the header (.lg\\:hidden block)
    const burgerMenu = page.locator('.lg\\:hidden button').first()
    await expect(burgerMenu).toBeVisible()
    
    // Click to open sidebar overlay
    await burgerMenu.click()
    // Wait for the overlay and sidebar to open, then look for the close button
    await page.waitForTimeout(500) // wait for transition
    // Close button might be inside the sidebar
    await expect(page.locator('button').filter({ hasText: '' }).last()).toBeVisible()
  })
})
