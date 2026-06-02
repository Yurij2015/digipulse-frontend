import { expect, test } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock authentication cookies
    await context.addCookies([
      { name: 'auth-token', value: 'fake-token', url: 'http://127.0.0.1:3000' },
      { name: 'auth-user', value: JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com' }), url: 'http://127.0.0.1:3000' }
    ])

    // Mock API requests
    await page.route('**/api/v1/me', async route => {
      await route.fulfill({ json: { user: { id: 1, name: 'Test User', email: 'test@example.com' } } })
    })

    await page.route('**/api/v1/sites*', async route => {
      await route.fulfill({
        json: {
          data: [
            {
              id: 1,
              name: 'My Awesome Site',
              url: 'https://example.com',
              status: 'Online',
              uptime: 99.9,
              responseTime: 120,
              lastCheck: new Date().toISOString()
            }
          ],
          meta: { total: 1, current_page: 1, last_page: 1 }
        }
      })
    })

    await page.route('**/api/v1/sites/status-counts', async route => {
      await route.fulfill({
        json: { total: 1, online: 1, offline: 0, slow: 0 }
      })
    })
  })

  test('Dashboard shows statistics', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=Total').first()).toBeVisible()
    await expect(page.locator('text=Online').first()).toBeVisible()
    await expect(page.locator('text=Offline').first()).toBeVisible()
  })

  test('Dashboard shows sites list', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=My Awesome Site')).toBeVisible()
    await expect(page.locator('text=example.com').first()).toBeVisible()
  })

  test('Sidebar shows tariff limits progress bar', async ({ page }) => {
    await page.goto('/dashboard')
    // Open sidebar on mobile if needed, but on desktop it's visible
    await expect(page.locator('text=Current Plan').first()).toBeVisible()
  })
})
