import { describe, expect, it } from 'vitest';
import { SITE } from '@/config/site';
import { faqPageSchema, localBusinessSchema } from '@/lib/schema';

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
