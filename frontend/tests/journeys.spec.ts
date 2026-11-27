import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { signIn, submitAccount } from './auth-helpers';

async function scenario(page: Page, key: string) {
  const returnTo = page.url();
  await page.goto('/_dev');
  await page.getByRole('combobox', { name: 'حالة الاختبار' }).selectOption(key);
  await page.goto(returnTo);
}

async function prepareDecision(page: Page) {
  await page.getByRole('link', { name: /إعداد قرار/ }).click();
  await page.getByRole('radio', { name: 'تأكيد السماح' }).check();
  await page.getByLabel(/ملاحظة للمراجعة/).fill('مراجعة الأدلة المتاحة في سجل الحقوق.');
  await page.getByRole('button', { name: 'معاينة القرار' }).click();
  await expect(page).toHaveURL(/\/confirm$/);
}

test('public entry, owner journeys, filters, notices and role guard', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'المطابقة البصرية' }).click();
  await expect(page.getByRole('img', { name: 'صورة مرجعية للمقارنة' })).toBeVisible();
  await page.getByRole('link', { name: 'تسجيل الدخول' }).click();
  await expect(page.getByRole('button', { name: 'تسجيل الدخول', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /صاحب الحق|المراجع/ })).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/تجريبي|سيناريو العرض|دخول فريق التطوير/);
  await submitAccount(page, 'rights_holder');
  await expect(page.getByRole('heading', { name: 'النظرة العامة' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'صورة الاستخدام المقدّمة من السوق' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'الصورة المستخدمة للمقارنة' })).toBeVisible();
  await page.getByRole('link', { name: 'فتح تفاصيل التحقق' }).click();
  await expect(page.getByRole('heading', { name: 'مقارنة الصور' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'خلاصة الحالة' })).toBeVisible();
  await page.locator('main').getByRole('link', { name: 'النظرة العامة', exact: true }).click();
  await expect(page.getByRole('link', { name: 'فتح تفاصيل التحقق' })).toBeFocused();
  await page.getByRole('link', { name: 'عرض المصنفات' }).click();
  await expect(page.getByText('إجمالي المصنفات')).toBeVisible();
  await page.getByRole('searchbox').fill('unmatched');
  await expect(page.getByText('لا توجد مصنفات مطابقة في هذه القائمة.')).toBeVisible();
  await page.getByRole('searchbox').fill('REG');
  await page.getByRole('link', { name: /مزهرية/ }).click();
  await expect(page.getByRole('heading', { name: 'بيانات التسجيل' })).toBeVisible();
  await expect(page.getByText('إذن مسجّل', { exact: true })).toBeVisible();
  await page.locator('main').getByRole('link', { name: 'المصنفات', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('REG');
  await expect(page.getByRole('link', { name: /مزهرية/ })).toBeFocused();
  await page.getByRole('link', { name: 'نشاط الاستخدام', exact: true }).click();
  await page.getByRole('link', { name: /ver_1005/ }).click();
  await expect(page.getByRole('heading', { name: 'مراحل التحقق من الصورة' })).toBeVisible();
  await expect(page.getByText('تعليق النشر للمراجعة', { exact: true })).toBeVisible();
  const inspect = page.getByRole('button', { name: 'تكبير الصور' });
  await inspect.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'إغلاق المعاينة' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(inspect).toBeFocused();
  await page.getByText('تفاصيل الطلب والمصادر').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('معرّف البائع من السوق')).toBeVisible();
  await page.getByRole('link', { name: 'التنبيهات', exact: true }).click();
  const reading = page.getByLabel('حالة القراءة');
  await reading.selectOption('read');
  await expect(page.getByText('لا توجد تنبيهات تطابق المرشحات.')).toBeVisible();
  await reading.selectOption('unread');
  await expect(page.getByRole('img', { name: 'الصورة المرتبطة بالتنبيه' })).toBeVisible();
  await page.getByRole('button', { name: 'تحديد كمقروء' }).click();
  await expect(page.getByRole('button', { name: 'تحديد كمقروء' })).toHaveCount(0);
  await expect(page.getByText('لا توجد تنبيهات تطابق المرشحات.')).toBeVisible();
  await reading.selectOption('read');
  await expect(page.getByRole('heading', { name: 'محاولة استخدام تحتاج مراجعة' })).toBeVisible();
  await page.goto('/review/cases/case_001');
  await expect(page.getByRole('alert')).toContainText('صلاحية');
  await expect(page.getByRole('heading', { name: 'مساحة الأدلة' })).toHaveCount(0);
});

test('reviewer session survives reload and sign-out clears it', async ({ page }) => {
  await signIn(page, 'reviewer');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'طابور المراجعة' })).toBeVisible();
  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  await expect(page.getByRole('button', { name: /صاحب الحق|المراجع/ })).toHaveCount(0);
  await submitAccount(page, 'reviewer', true);
  await expect(page.getByRole('heading', { name: 'طابور المراجعة' })).toBeVisible();
});

test('login validates fields, toggles password visibility and rejects invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  const email = page.getByLabel('البريد الإلكتروني', { exact: true });
  const password = page.getByLabel('كلمة المرور', { exact: true });
  const submit = page.getByRole('button', { name: 'تسجيل الدخول', exact: true });
  await submit.click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(password).toHaveAttribute('aria-invalid', 'true');
  await email.fill('invalid');
  await password.fill('incorrect');
  await submit.click();
  await expect(page.getByText('أدخل بريدًا إلكترونيًا صالحًا.')).toBeVisible();
  await email.fill('owner@example.test');
  await page.getByRole('button', { name: 'إظهار كلمة المرور' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'إخفاء كلمة المرور' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await password.press('Enter');
  await expect(page.getByRole('alert')).toContainText('غير صحيحة');
  await expect(page).toHaveURL(/\/login$/);
  await submitAccount(page, 'rights_holder', true);
});

for (const [key, label] of [
  ['hold_no_authorization', 'تعليق النشر للمراجعة'], ['allow_no_match', 'سماح'], ['allow_authorized', 'إذن مسجّل'],
  ['review_ambiguous_match', 'إشارة بصرية غير حاسمة.'], ['review_unknown_authorization', 'تعذّر تأكيد الإذن'],
  ['registry_unavailable', 'النتيجة غير متاحة'], ['backend_error', 'تعذّر تحميل البيانات. أعد المحاولة.'],
]) {
  test('verification scenario: ' + key, async ({ page }) => {
    await signIn(page, 'rights_holder');
    await scenario(page, key);
    await page.goto('/portal/verifications/ver_1005');
    await expect(page.locator('main').getByText(label, { exact: true })).toBeVisible();
    if (key === 'registry_unavailable') {
      await expect(page.getByText(/توقف التحقق عند السجل/)).toBeVisible();
      await expect(page.getByText('سماح', { exact: true })).toHaveCount(0);
    }
  });
}

test('reviewer prepares, edits, submits and reloads the recorded result', async ({ page }) => {
  await signIn(page, 'reviewer');
  await page.getByRole('link', { name: /case_001/ }).click();
  await prepareDecision(page);
  const preview = page.getByRole('heading', { name: 'تأكيد السماح' });
  await expect(preview).toHaveCSS('view-transition-name', 'review-decision');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(preview).toHaveCSS('view-transition-name', 'none');
  await page.getByRole('link', { name: 'رجوع للتعديل' }).click();
  await expect(page.getByRole('radio', { name: 'تأكيد السماح' })).toBeChecked();
  await page.getByRole('button', { name: 'معاينة القرار' }).click();
  await page.getByRole('button', { name: 'تأكيد القرار' }).click();
  await expect(page.getByRole('status')).toContainText('تم تسجيل قرار المراجعة');
  await page.reload();
  await expect(page.getByText('تأكيد السماح', { exact: true })).toBeVisible();
  await expect(page.getByText('مراجعة الأدلة المتاحة في سجل الحقوق.')).toBeVisible();
  await expect(page.getByRole('link', { name: /إعداد قرار/ })).toHaveCount(0);
});

test('a stale confirmation must be prepared again', async ({ page }) => {
  await signIn(page, 'reviewer');
  await scenario(page, 'review_conflict');
  await page.getByRole('link', { name: /case_001/ }).click();
  await prepareDecision(page);
  await page.getByRole('button', { name: 'تأكيد القرار' }).click();
  await expect(page.getByRole('alert')).toContainText('تغيّرت الحالة');
  await expect(page.getByRole('button', { name: 'تأكيد القرار' })).toHaveCount(0);
  await page.getByRole('link', { name: 'عرض أحدث بيانات الحالة' }).click();
  await prepareDecision(page);
  await page.getByRole('button', { name: 'تأكيد القرار' }).click();
  await expect(page.getByRole('status')).toContainText('تم تسجيل قرار المراجعة');
});

test('mobile, tablet and desktop layouts, accessibility and reduced motion', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('heading', { level: 1 }).waitFor();
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: info.outputPath('entry-desktop.png'), fullPage: true });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'انتقل إلى المحتوى' })).toBeFocused();
  expect(await page.locator('.art-signal').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  const accessibility = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect((await accessibility()).violations).toEqual([]);
  await signIn(page, 'rights_holder');
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ['/portal', '/portal/works', '/portal/works/work_001', '/portal/activity', '/portal/verifications/ver_1005', '/portal/notifications']) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.getByText('جارٍ تحميل البيانات')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route + ' @ ' + width).toBeLessThanOrEqual(width);
    }
  }
  await page.goto('/portal/verifications/ver_1005');
  await expect(page.getByRole('img', { name: 'الصورة المقدّمة من السوق' })).toBeVisible();
  await expect.poll(() => page.locator('.image-pair img').evaluateAll(images => images.every(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0))).toBe(true);
  await page.screenshot({ path: info.outputPath('verification-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: info.outputPath('verification-mobile.png'), fullPage: true });
  expect((await accessibility()).violations).toEqual([]);
  await page.getByRole('button', { name: 'تسجيل الخروج' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await signIn(page, 'reviewer');
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/review');
    await page.getByRole('link', { name: /case_001/ }).click();
    await expect(page.getByRole('heading', { name: 'مساحة الأدلة' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await prepareDecision(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.screenshot({ path: info.outputPath('confirmation-desktop.png'), fullPage: true });
  expect((await accessibility()).violations).toEqual([]);
});
