import { expect, test } from '@playwright/test'

test.describe('Additional Sections', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'auth-token', value: 'fake-token', url: 'http://127.0.0.1:3000' },
      { name: 'auth-user', value: JSON.stringify({ id: 1, name: 'Test', first_name: 'Test', last_name: 'User', email: 'test@example.com' }), url: 'http://127.0.0.1:3000' }
    ])
    await page.route('**/api/v1/support/tickets', async route => {
      await route.fulfill({ json: { data: [] } })
    })
  })

  test('Knowledge Base loads', async ({ page }) => {
    await page.goto('/knowledge-base')
    // Check for some header or typical knowledge base elements
    await expect(page.locator('h1').filter({ hasText: /Knowledge Base/i })).toBeVisible()
  })

  test('Support page loads', async ({ page }) => {
    await page.goto('/support')
    // Check for contact form or support header
    await expect(page.locator('h1', { hasText: 'Support' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'New Ticket' }).first()).toBeVisible()
  })

  test('Privacy Policy page loads', async ({ page }) => {
    await page.goto('/privacy')
    // Should have privacy policy content
    await expect(page.locator('h1').filter({ hasText: /Privacy/i })).toBeVisible()
  })

  test('Terms of Service page loads', async ({ page }) => {
    await page.goto('/terms')
    // Should have ToS content
    await expect(page.locator('h1').filter({ hasText: /Terms/i })).toBeVisible()
  })
})
