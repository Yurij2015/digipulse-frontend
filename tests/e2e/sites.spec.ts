import { expect, test } from '@playwright/test'

test.describe('Site Management', () => {
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
      await route.fulfill({
        json: {
          data: [
            { id: 1, name: 'Site to Edit', url: 'https://edit.me' }
          ],
          meta: { total: 1, current_page: 1, last_page: 1 }
        }
      })
    })

    // Mock check-types
    await page.route('**/api/v1/check-types', async route => {
      await route.fulfill({
        json: [{ id: 1, name: 'HTTP Check', slug: 'http', is_active: true }]
      })
    })

    // Mock status-counts for dashboard
    await page.route('**/api/v1/sites/status-counts', async route => {
      await route.fulfill({
        json: { total: 1, online: 1, offline: 0, slow: 0 }
      })
    })
  })

  test('Add Site modal can be opened and filled', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    await page.locator('button', { hasText: 'Add Site' }).first().click()
    await expect(page.locator('input[placeholder="Enter a descriptive name"]')).toBeVisible()
    await expect(page.locator('input[placeholder="https://example.com"]')).toBeVisible()
    await expect(page.locator('button', { hasText: 'Add Site' }).last()).toBeVisible()
  })

  test('Edit Site modal populates data', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    // Click the edit pencil icon
    await page.locator('[class*="pencil"]').first().click()
    await expect(page.locator('input[placeholder="Enter a descriptive name"]')).toHaveValue('Site to Edit')
    await expect(page.locator('button', { hasText: 'Save Changes' })).toBeVisible()
  })

  test('Delete Site modal shows up', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    // Click the delete trash icon
    await page.locator('[class*="trash"]').first().click()
    await expect(page.locator('text=Confirm Delete')).toBeVisible()
    await expect(page.locator('button', { hasText: 'Delete' })).toBeVisible()
  })

  test('Detailed Site Statistics and History pages load', async ({ page }) => {
    await page.route('**/api/v1/sites/1', async route => {
      await route.fulfill({
        json: { data: { id: 1, name: 'Site to Edit', url: 'https://edit.me', checks: [] } }
      })
    })
    await page.route('**/api/v1/sites/1/history*', async route => {
      await route.fulfill({ json: { 
        stats: [
          { timestamp: new Date().toISOString(), response_time: 120, uptime: 100 }
        ],
        incidents: [{ checked_at: new Date().toISOString(), error_message: 'Timeout' }],
        latest_results: []
      } })
    })
    
    await page.goto('/sites/1/history')
    // The LineChart component canvas should be visible
    await expect(page.locator('canvas')).toHaveCount(1)
    
    // Click the Downtime Incidents tab
    await page.locator('button', { hasText: 'Downtime Incidents' }).click()
    
    await expect(page.locator('h3').filter({ hasText: 'Incidents' }).first()).toBeVisible()
  })
})
