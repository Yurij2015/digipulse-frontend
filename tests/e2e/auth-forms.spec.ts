import { expect, test } from '@playwright/test'

test.describe('Auth forms', () => {
  test('login form has correct field types', async ({ page }) => {
    await page.goto('/auth/login')

    const email = page.locator('input[name="email"]')
    const password = page.locator('input[name="password"]')

    await expect(email).toHaveAttribute('type', 'email')
    await expect(password).toHaveAttribute('type', 'password')
  })

  test('register form has correct field types', async ({ page }) => {
    await page.goto('/auth/register')

    const email = page.locator('input[name="email"]')
    const password = page.locator('input[name="password"]')
    const confirmPassword = page.locator('input[name="confirmPassword"]')

    await expect(email).toHaveAttribute('type', 'email')
    await expect(password).toHaveAttribute('type', 'password')
    await expect(confirmPassword).toHaveAttribute('type', 'password')
  })

  test('login form has no error banner in normal mode', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Authentication failed. Please contact support.')).toHaveCount(0)
  })

  test('register form has no error banner in normal mode', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByText('Authentication failed. Please contact support.')).toHaveCount(0)
  })

  test('login form shows UI error banner from auth callback', async ({ page }) => {
    await page.goto('/auth/login?error=auth_failed')
    await expect(page.getByText('Authentication failed. Please contact support.')).toBeVisible()
  })

  test('register form shows UI error banner from auth callback', async ({ page }) => {
    await page.goto('/auth/register?error=auth_failed')
    await expect(page.getByText('Authentication failed. Please contact support.')).toBeVisible()
  })
})

