import { expect, test } from '@playwright/test';

const banner = '#cc-main .cm';

test('primera visita: el banner muestra los tres botones', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(banner)).toBeVisible();
  for (const nombre of ['Aceptar', 'Rechazar', 'Configurar']) {
    await expect(page.locator(banner).getByRole('button', { name: nombre })).toBeVisible();
  }
});

test('rechazar: sin iframes de YouTube/Maps ni scripts de analítica', async ({ page }) => {
  await page.goto('/contacto');
  await page.locator(banner).getByRole('button', { name: 'Rechazar' }).click();

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(
    page.locator(
      'script[src*="googletagmanager"], script[src*="google-analytics"], script[data-category="analytics"]:not([type="text/plain"])',
    ),
  ).toHaveCount(0);
});

test('la decisión persiste al recargar', async ({ page }) => {
  await page.goto('/');
  await page.locator(banner).getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.locator(banner)).toBeHidden();

  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(banner)).toBeHidden();
  expect((await page.context().cookies()).some((c) => c.name === 'cc_cookie')).toBe(true);
});
