import { test, expect } from '@playwright/test';

test('4.1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Run' }).first().click();
    await expect(page.getByLabel('Execution logs will appear')).toContainText('[localhost] => { "msg": "Hello World!" }');
  });


  test('4.2', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Run' }).first().click();
    await expect(page.getByLabel('Execution logs will appear')).not.toHaveText('');
  });


  test('4.3', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('Search playbooks...').click();
    await page.getByLabel('Search playbooks...').fill('print');
    await expect(page.locator('tbody')).not.toContainText('hello_world.yml');
  });

  test('4.4', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('Search playbooks...').click();
    await page.getByLabel('Search playbooks...').fill('print');
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('\'{"custom_message": "Hello, Ansible!"}\'');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByLabel('Execution logs will appear')).toContainText('[localhost] => { "msg": "Hello, Ansible!" }');
  });

  test('4.5', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('admin');
    await page.locator('div').filter({ hasText: /^User LoginUsernameUsernamePasswordPasswordLogin$/ }).getByRole('button').click();
    await page.getByLabel('Search playbooks...').click();
    await page.getByLabel('Search playbooks...').fill('limit');
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill('localhost');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByLabel('Execution logs will appear')).not.toContainText('[host_2]');
  });