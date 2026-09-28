import { expect, test } from '@playwright/test';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Solo aplica al viewport móvil');
});

test('menú móvil: abre, Escape lo cierra y el foco vuelve al botón', async ({ page }) => {
  await page.goto('/');
  const boton = page.getByRole('button', { name: 'Abrir menú' });
  await expect(boton).toHaveAttribute('aria-expanded', 'false');

  await boton.click();
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(menu.getByRole('link').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
});

test('el CTA fijo es visible en móvil y enlaza a /reservar', async ({ page }) => {
  await page.goto('/bailes');
  const cta = page.getByRole('link', { name: 'Reservar clase gratis' }).last();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '/reservar');
});
