import { expect, type Page } from '@playwright/test';

const accounts = {
  seller: ['seller@example.test', 'Seller-4826', '/marketplace/pre-publish'],
  rights_holder: ['owner@example.test', 'Owner-4826', '/portal'],
  reviewer: ['reviewer@example.test', 'Review-4826', '/review'],
};

export async function submitAccount(page: Page, role: keyof typeof accounts, keyboard = false) {
  const [identifier, password, destination] = accounts[role];
  await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(identifier);
  const passwordInput = page.getByLabel('كلمة المرور', { exact: true });
  await passwordInput.fill(password);
  if (keyboard) await passwordInput.press('Enter');
  else await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(destination + '$'));
}

export async function signIn(page: Page, role: keyof typeof accounts) {
  await page.goto('/login');
  await submitAccount(page, role);
}
