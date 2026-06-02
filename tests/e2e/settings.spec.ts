import { expect, test } from '@playwright/test'

test.describe('Profile and Settings', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie_consent_v2', JSON.stringify({ essential: true, analytics: true, marketing: true }))
    })

    await context.addCookies([
      { name: 'auth-token', value: 'fake-token', url: 'http://127.0.0.1:3000' },
      { name: 'auth-user', value: JSON.stringify({ id: 1, name: 'Test', first_name: 'Test', last_name: 'User', email: 'test@example.com', is_verified: true }), url: 'http://127.0.0.1:3000' }
    ])

    await page.route('**/api/v1/me', async route => {
      await route.fulfill({ json: { user: { id: 1, name: 'Test', first_name: 'Test', last_name: 'User', email: 'test@example.com', is_verified: true } } })
    })

    await page.route('**/api/v1/mcp/tokens', async route => {
      await route.fulfill({ json: { data: [] } })
    })
  })

  test('Personal Data can be edited', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForResponse('**/api/v1/me')
    await expect(page.locator('text=@Test')).toBeVisible()
    await expect(page.locator('text=Edit Profile')).toBeVisible()
    await page.locator('button', { hasText: 'Edit Profile' }).click()
    
    await expect(page.locator('form').first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Save Changes' })).toBeVisible()
  })

  test('Security panel allows changing password', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Change Password' })).toBeVisible()
  })

  test('Notification Settings toggles are visible', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.locator('text=Email Notifications').first()).toBeVisible()
    await expect(page.locator('text=Telegram Notifications').first()).toBeVisible()
    // Should have switches
    await expect(page.locator('button[role="switch"]')).toHaveCount(2)
  })
})
