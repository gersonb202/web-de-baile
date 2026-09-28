import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Hero from '@/components/sections/Hero.astro';

describe('Hero', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Hero);

  it('tiene exactamente un <h1>', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('enlaza a /reservar', () => {
    expect(html).toContain('href="/reservar"');
  });
});
