import { expect, test } from '@playwright/test';
import { signIn, submitAccount } from './auth-helpers';

for (const [scenario, result] of [
  ['allow_authorized', 'يمكن للسوق متابعة النشر'],
  ['review_unknown_authorization', 'تحتاج الصورة إلى مراجعة'],
  ['hold_no_authorization', 'النشر معلّق'],
  ['registry_unavailable', 'لم تكتمل عملية التحقق'],
  ['backend_error', 'تعذّر تحميل البيانات'],
]) {
  test('marketplace response: ' + scenario, async ({ page }) => {
    await page.goto('/_dev');
    await page.getByRole('combobox').selectOption(scenario);
    await signIn(page, 'seller');
    await page.getByLabel('اسم المنتج').fill('مزهرية');
    await page.getByLabel('اختيار ملف الصورة').setInputFiles('public/media/ceramic.jpg');
    await expect(page.getByRole('img', { name: 'معاينة صورة المنتج' })).toBeVisible();
    await page.getByRole('button', { name: 'التحقق ومتابعة النشر' }).click();
    await expect(page.getByText(result, { exact: false })).toBeVisible();
    await expect(page.locator('input[name=seller_id]')).toHaveCount(0);
    await expect(page.getByRole('img', { name: 'معاينة صورة المنتج' })).toBeVisible();
    if (scenario === 'allow_authorized') {
      await page.getByRole('button', { name: 'إزالة الصورة' }).click();
      await expect(page.getByRole('img')).toHaveCount(0);
      await page.getByLabel('اختيار ملف الصورة').setInputFiles({ name: 'sample.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
      await expect(page.getByRole('alert')).toContainText('تعذّر استخدام هذا الملف');
    }
  });
}

test('marketplace controls work on narrow and wide layouts', async ({ page }) => {
  await page.goto('/marketplace/pre-publish');
  await expect(page.getByLabel('اسم المنتج')).toHaveCount(0);
  await page.getByRole('link', { name: 'تسجيل الدخول', exact: true }).click();
  await submitAccount(page, 'seller');
  await page.reload();
  await page.goto('/portal');
  await expect(page.getByRole('alert')).toContainText('ليس لديك صلاحية');
  await page.goto('/marketplace/pre-publish');
  const trace = page.getByRole('list', { name: 'مراحل التحقق' });
  await expect(trace.locator('[aria-current="step"]')).toHaveText('صورة المنتج');
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel('اسم المنتج').fill('مزهرية مصنوعة يدويًا من الخزف الأزرق للمجموعات المنزلية'.repeat(4));
  await page.getByLabel('التقاط صورة بالكاميرا').setInputFiles('public/media/submission.jpg');
  await expect(page.getByRole('img', { name: 'معاينة صورة المنتج' })).toBeVisible();
  const fileInput = page.getByLabel('اختيار ملف الصورة');
  await fileInput.focus();
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), fileInput.press('Enter')]);
  await chooser.setFiles('public/media/ceramic.jpg');
  await expect(page.getByText('ceramic.jpg')).toBeVisible();
  await page.getByRole('button', { name: 'التحقق ومتابعة النشر' }).click();
  await expect(page.locator('.market-result')).toBeVisible();
  await expect(trace.locator('[aria-current="step"]')).toHaveText('النتيجة');
  await expect(trace.locator('[data-complete="true"]')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/marketplace/pre-publish');
  await expect(page.getByLabel('اسم المنتج')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'تسجيل الدخول', exact: true })).toBeVisible();
});
