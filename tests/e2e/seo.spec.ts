import { expect, test } from '@playwright/test';
import { rutasSitemap } from './helpers';

test('cada ruta del sitemap tiene los metadatos SEO básicos', async ({ page, request }) => {
  const rutas = await rutasSitemap(request);
  expect(rutas.length).toBeGreaterThan(15);

  for (const ruta of rutas) {
    await page.goto(ruta);
    await expect(page.locator('h1'), `${ruta}: h1`).toHaveCount(1);
    const title = (await page.title()).trim();
    expect(title, `${ruta}: title`).not.toBe('');
    expect(title.length, `${ruta}: title ≤ 60`).toBeLessThanOrEqual(60);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.trim(), `${ruta}: description`).toBeTruthy();
    expect(description?.length ?? 0, `${ruta}: description ≤ 155`).toBeLessThanOrEqual(155);
    await expect(page.locator('link[rel="canonical"]'), `${ruta}: canonical`).toHaveCount(1);
  }
});
