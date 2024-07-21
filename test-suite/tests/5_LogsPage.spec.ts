import { test, expect } from '@playwright/test';

test('5.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('menu').click();
    await page.getByRole('link', { name: 'Logs' }).click();
    await expect(page.getByRole('list')).toContainText('admin_hello_world');
});

test('5.2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Logs' }).click();
  await page.getByLabel('Search logs...').click();
  await page.getByLabel('Search logs...').fill('print');
  await expect(page.getByRole('list')).not.toContainText('admin_hello_world');
  await expect(page.getByRole('link').first()).toContainText('admin_print_var');
});

test('5.3', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Logs' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link').filter({ hasText: /^admin_hello_world/ }).first().click();
  const page1 = await page1Promise;
  await expect(page1.locator('pre')).toContainText('STDOUT: PLAY [Print Hello World]');
});