export const NIVELES = ['Iniciación', 'Intermedio', 'Avanzado'] as const;
export type Nivel = (typeof NIVELES)[number];

export interface ReservaData {
  nombre: string;
  baile: string;
  nivel: string;
  preferencia?: string | undefined;
}

const MAX_NOMBRE = 60;
const MAX_BAILE = 30;
const MAX_PREFERENCIA = 120;

/** Limpia espacios y caracteres de control, y recorta la longitud. */
export function sanitize(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function isNivel(value: string): value is Nivel {
  return (NIVELES as readonly string[]).includes(value);
}

/** Genera la URL `wa.me` con el mensaje de reserva ya codificado. Lanza si los datos no son válidos. */
export function buildWhatsAppUrl(phone: string, data: ReservaData): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!/^\d{8,15}$/.test(cleanPhone)) {
    throw new Error('Número de WhatsApp no válido');
  }

  const nombre = sanitize(data.nombre, MAX_NOMBRE);
  const baile = sanitize(data.baile, MAX_BAILE);
  if (!nombre) throw new Error('El nombre es obligatorio');
  if (!baile) throw new Error('El baile es obligatorio');
  if (!isNivel(data.nivel)) throw new Error('Nivel no válido');

  const lineas = [
    `¡Hola! Soy ${nombre}.`,
    `Me gustaría reservar mi clase gratuita de ${baile}.`,
    `Nivel: ${data.nivel}.`,
  ];

  const preferencia = data.preferencia ? sanitize(data.preferencia, MAX_PREFERENCIA) : '';
  if (preferencia) lineas.push(`Preferencia de horario: ${preferencia}.`);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lineas.join('\n'))}`;
}
