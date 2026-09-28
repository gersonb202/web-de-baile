import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Evita salir a WhatsApp de verdad.
  await context.route(/^https:\/\/wa\.me\//, (route) => route.fulfill({ status: 200, body: 'ok' }));
});

test('el formulario completo abre WhatsApp con el mensaje correcto', async ({ page }) => {
  await page.goto('/reservar?baile=bachata');
  await expect(page.getByLabel('¿Qué quieres bailar?')).toHaveValue('Bachata');

  await page.getByLabel('Nombre').fill('Ana');
  await page.getByLabel('Intermedio').check();
  await page.getByLabel('Día u horario preferido (opcional)').fill('Tardes');
  await page.getByLabel(/política de privacidad/).check();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Reservar por WhatsApp' }).click(),
  ]);
  await popup.waitForURL(/^https:\/\/wa\.me\/\d+\?text=/);

  const url = new URL(popup.url());
  const text = url.searchParams.get('text') ?? '';
  expect(text).toContain('Soy Ana.');
  expect(text).toContain('clase gratuita de Bachata');
  expect(text).toContain('Nivel: Intermedio.');
  expect(text).toContain('Preferencia de horario: Tardes.');
});

test('sin campos obligatorios no se abre WhatsApp', async ({ page, context }) => {
  await page.goto('/reservar');
  let abierto = false;
  context.on('page', () => {
    abierto = true;
  });

  await page.getByRole('button', { name: 'Reservar por WhatsApp' }).click();

  await expect(page.getByRole('alert').filter({ hasText: 'Revisa los campos' })).toBeVisible();
  await page.waitForTimeout(300);
  expect(abierto).toBe(false);
});
