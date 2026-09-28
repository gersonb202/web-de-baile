import type { APIRequestContext } from '@playwright/test';

/** Rutas públicas indexables, leídas del sitemap generado (solo el pathname). */
export async function rutasSitemap(request: APIRequestContext): Promise<string[]> {
  const res = await request.get('/sitemap-0.xml');
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap((m) => {
    const loc = m[1];
    if (loc === undefined) return [];
    const { pathname } = new URL(loc);
    return [pathname === '' ? '/' : pathname];
  });
}

/** Páginas públicas que no están en el sitemap (`noindex`). */
export const RUTAS_NOINDEX = ['/aviso-legal', '/privacidad', '/cookies'] as const;
