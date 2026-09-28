import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, isNivel, sanitize } from '@/lib/whatsapp';

const PHONE = '34600000000';
const base = { nombre: 'Ana', baile: 'Salsa', nivel: 'Iniciación' };

function mensaje(url: string): string {
  return decodeURIComponent(new URL(url).searchParams.get('text') ?? '');
}

describe('buildWhatsAppUrl', () => {
  it('genera una URL wa.me válida con el mensaje', () => {
    const url = buildWhatsAppUrl(PHONE, base);
    expect(url.startsWith(`https://wa.me/${PHONE}?text=`)).toBe(true);
    expect(mensaje(url)).toContain('Soy Ana.');
    expect(mensaje(url)).toContain('clase gratuita de Salsa');
    expect(mensaje(url)).toContain('Nivel: Iniciación.');
  });

  it('codifica caracteres especiales', () => {
    const url = buildWhatsAppUrl(PHONE, { ...base, nombre: 'Ana & Co #1?' });
    expect(url).not.toMatch(/[ &#]/);
    expect(new URL(url).searchParams.get('text')).toContain('Ana & Co #1?');
  });

  it('acepta el teléfono con símbolos y espacios', () => {
    expect(buildWhatsAppUrl('+34 600 000 000', base)).toContain('wa.me/34600000000');
  });

  it('incluye la preferencia solo si tiene contenido', () => {
    expect(mensaje(buildWhatsAppUrl(PHONE, { ...base, preferencia: 'Tardes' }))).toContain(
      'Preferencia de horario: Tardes.',
    );
    expect(mensaje(buildWhatsAppUrl(PHONE, { ...base, preferencia: '  ' }))).not.toContain(
      'Preferencia',
    );
  });

  it('lanza con un teléfono inválido', () => {
    expect(() => buildWhatsAppUrl('123', base)).toThrow('Número de WhatsApp no válido');
  });

  it('lanza con un nombre vacío', () => {
    expect(() => buildWhatsAppUrl(PHONE, { ...base, nombre: '   ' })).toThrow('nombre');
  });

  it('lanza con un baile vacío', () => {
    expect(() => buildWhatsAppUrl(PHONE, { ...base, baile: '' })).toThrow('baile');
  });

  it('lanza con un nivel desconocido', () => {
    expect(() => buildWhatsAppUrl(PHONE, { ...base, nivel: 'Experto' })).toThrow('Nivel');
  });
});

describe('sanitize', () => {
  it('limpia espacios y caracteres de control', () => {
    expect(sanitize('  Ana \n\t  María\u0000 ', 60)).toBe('Ana María');
  });

  it('recorta a la longitud máxima', () => {
    expect(sanitize('abcdefghij', 4)).toBe('abcd');
  });
});

describe('isNivel', () => {
  it('reconoce solo niveles válidos', () => {
    expect(isNivel('Intermedio')).toBe(true);
    expect(isNivel('intermedio')).toBe(false);
  });
});
