import { test, expect } from '@playwright/test';

test('3.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('menu').click();
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page.locator('li').filter({ hasText: 'localhost' })).toBeVisible();
});

test('3.2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Inventory' }).click();
  await page.getByLabel('Add host...').click();
  await page.getByLabel('Add host...').fill('host_3');
  await page.getByRole('button', { name: 'Add Line' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Inventory' }).click();
  await expect(page.getByRole('list')).toContainText('host_3');
});


test('3.3', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Inventory' }).click();
  await page.locator('li').filter({ hasText: 'host_3' }).getByLabel('delete').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Inventory' }).click();
  await expect(page.getByRole('list')).not.toContainText('host_3');
});