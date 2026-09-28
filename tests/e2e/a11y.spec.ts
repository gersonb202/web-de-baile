import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { rutasSitemap, RUTAS_NOINDEX } from './helpers';

// Sin animaciones: el fundido del banner de cookies falsea el cálculo de contraste.
test.use({ reducedMotion: 'reduce' });

test('0 violaciones axe (WCAG 2.x AA) en todas las páginas públicas', async ({ page, request }) => {
  const rutas = [...(await rutasSitemap(request)), ...RUTAS_NOINDEX];

  for (const ruta of rutas) {
    await page.goto(ruta);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
      ruta,
    ).toEqual([]);
  }
});
