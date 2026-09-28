/** Fondos claros por baile (texto siempre `noche`); el nombre del baile se muestra siempre en texto. */
export const COLOR_BAILE: Record<string, string> = {
  salsa: 'bg-orange-200',
  bachata: 'bg-pink-200',
  breakdance: 'bg-sky-200',
  zumba: 'bg-lime-200',
  kizomba: 'bg-violet-200',
};

export function colorBaile(baile: string): string {
  return COLOR_BAILE[baile] ?? 'bg-gray-200';
}

export function nombreBaile(baile: string): string {
  return baile.charAt(0).toUpperCase() + baile.slice(1);
}
