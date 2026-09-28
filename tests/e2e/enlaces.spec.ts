import { expect, test } from '@playwright/test';
import { rutasSitemap, RUTAS_NOINDEX } from './helpers';

test('todas las URLs del sitemap responden 200', async ({ request }) => {
  const rutas = [...(await rutasSitemap(request)), ...RUTAS_NOINDEX];
  for (const ruta of rutas) {
    const res = await request.get(ruta);
    expect(res.status(), ruta).toBe(200);
  }
});
