import type { APIContext } from 'astro';
import { SITE } from '@/config/site';

export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site ?? SITE.url);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
