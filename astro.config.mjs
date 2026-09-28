// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.escueladebaile.es',
  trailingSlash: 'never',
  prefetch: true,
  integrations: [
    mdx(),
    sitemap({
      // Las páginas legales son `noindex`: no deben aparecer en el sitemap.
      filter: (page) => !/\/(aviso-legal|privacidad|cookies)$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Sin scripts inline: la CSP de public/_headers usa `script-src 'self'`.
    build: { assetsInlineLimit: 0 },
  },
});
