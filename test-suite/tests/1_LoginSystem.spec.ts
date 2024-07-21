import { test, expect } from '@playwright/test';

test('1.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await expect(page.getByRole('banner')).toContainText('Logout (admin)');
});

test('1.2', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Logout (admin)' }).click();
    await expect(page.getByRole('banner')).toContainText('Login');
});

test('1.3', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('menu').click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByLabel('New Username').click();
    await page.getByLabel('New Username').fill('user');
    await page.getByLabel('New Password').click();
    await page.getByLabel('New Password').fill('user');
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Add User' }).click();
    await expect(page.getByRole('list')).toContainText('user');
});

test('1.4', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('menu').click();
    await page.getByRole('link', { name: 'Admin' }).click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.locator('li').filter({ hasText: 'user' }).getByLabel('delete').click();
    await expect(page.getByRole('list')).not.toContainText('user');
});