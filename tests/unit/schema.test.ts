import { describe, expect, it } from 'vitest';
import { SITE } from '@/config/site';
import {
  blogPostingSchema,
  breadcrumbListSchema,
  faqPageSchema,
  localBusinessSchema,
} from '@/lib/schema';

describe('localBusinessSchema', () => {
  const schema = localBusinessSchema();

  it('declara contexto y tipo de schema.org', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
  });

  it('incluye teléfono y dirección desde SITE', () => {
    expect(schema.telephone).toBe(SITE.phone);
    expect(schema.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
    });
  });
});

describe('faqPageSchema', () => {
  const schema = faqPageSchema([
    { pregunta: '¿Hay pareja?', respuesta: 'No hace falta.' },
    { pregunta: '¿Precio?', respuesta: 'Desde 30 €.' },
  ]);

  it('declara el tipo FAQPage', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
  });

  it('genera una Question con su Answer por cada pregunta', () => {
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: '¿Hay pareja?',
      acceptedAnswer: { '@type': 'Answer', text: 'No hace falta.' },
    });
  });
});

describe('blogPostingSchema', () => {
  const post = {
    title: 'Título',
    description: 'Descripción',
    pubDate: new Date('2026-03-10T00:00:00Z'),
    image: 'https://example.com/portada.jpg',
    url: 'https://example.com/blog/titulo',
  };

  it('declara el tipo BlogPosting con los campos requeridos', () => {
    const schema = blogPostingSchema(post);
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.headline).toBe('Título');
    expect(schema.image).toBe(post.image);
    expect(schema.datePublished).toBe('2026-03-10T00:00:00.000Z');
    expect(schema.mainEntityOfPage).toBe(post.url);
    expect(schema.author.name).toBe(SITE.name);
  });

  it('usa la fecha de publicación como modificación si no hay actualización', () => {
    expect(blogPostingSchema(post).dateModified).toBe('2026-03-10T00:00:00.000Z');
    const updated = blogPostingSchema({ ...post, updatedDate: new Date('2026-04-01T00:00:00Z') });
    expect(updated.dateModified).toBe('2026-04-01T00:00:00.000Z');
  });
});

describe('breadcrumbListSchema', () => {
  const schema = breadcrumbListSchema([
    { name: 'Inicio', url: 'https://example.com/' },
    { name: 'Bailes', url: 'https://example.com/bailes' },
  ]);

  it('declara el tipo BreadcrumbList', () => {
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('numera las posiciones desde 1 y conserva nombre y URL', () => {
    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://example.com/' },
      { '@type': 'ListItem', position: 2, name: 'Bailes', item: 'https://example.com/bailes' },
    ]);
  });
});
