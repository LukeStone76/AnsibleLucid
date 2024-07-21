import { test, expect } from '@playwright/test';

test('2.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('menu').click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByLabel('Playbook Directory')).toBeVisible();
    await expect(page.getByLabel('User')).toBeVisible();
    await expect(page.getByLabel('Log Directory')).toBeVisible();
});

test('2.2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('Playbook Directory').click();
  await page.getByLabel('Playbook Directory').fill('/home/luke/projects/AnsibleLucid/test-suite/test-repo');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page.getByLabel('Playbook Directory')).toHaveValue('/home/luke/projects/AnsibleLucid/test-suite/test-repo');
});

test('2.3', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('User').click();
  await page.getByLabel('User').fill('luke');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page.getByLabel('User')).toHaveValue('luke');
});

test('2.4', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('admin');
  await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
  await page.getByLabel('menu').click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('Log Directory').click();
  await page.getByLabel('Log Directory').fill('/home/luke/projects/AnsibleLucid/test-suite/test-repo/logs');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Settings' }).click();
  await expect(page.getByLabel('Log Directory')).toHaveValue('/home/luke/projects/AnsibleLucid/test-suite/test-repo/logs');
});