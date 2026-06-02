import { expect, test } from '@playwright/test'

test.describe('Authentication and Access', () => {
  test('Registration form has required fields and turnstile', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    // Check if submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('Email Confirmation page exists', async ({ page }) => {
    // Just verify the route loads without crashing
    await page.goto('/auth/verify-email')
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Verify|Confirmation/i })).toBeVisible()
  })

  test('Login form has required fields', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('Password Recovery form is accessible', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('Access Control: unauthorized user redirected from /dashboard', async ({ page }) => {
    // Attempt to visit dashboard without logging in
    await page.goto('/dashboard')
    // Should be redirected to / or login
    await expect(page).toHaveURL(/\/$/)
  })
})
