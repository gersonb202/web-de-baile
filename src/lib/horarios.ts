export const DIAS = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const;
export type Dia = (typeof DIAS)[number];

export const DIA_LABEL: Record<Dia, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

export interface Clase {
  id: string;
  dia: Dia;
  inicio: string; // "HH:MM"
  fin: string;
  baile: string; // slug
  nivel: string;
  profesor: string; // nombre
  sala?: string | undefined;
}

export interface FilaAgenda {
  hora: string;
  celdas: Clase[][]; // Una celda por día, en el orden de DIAS
}

/** Construye la rejilla hora × día. Las horas "HH:MM" ordenan bien como texto. */
export function construirRejilla(clases: Clase[]): FilaAgenda[] {
  const horas = [...new Set(clases.map((c) => c.inicio))].sort();
  return horas.map((hora) => ({
    hora,
    celdas: DIAS.map((dia) => clases.filter((c) => c.dia === dia && c.inicio === hora)),
  }));
}

/** Agrupa las clases por día (vista móvil), ordenadas por hora. Omite los días sin clases. */
export function agruparPorDia(clases: Clase[]): { dia: Dia; clases: Clase[] }[] {
  return DIAS.map((dia) => ({
    dia,
    clases: clases.filter((c) => c.dia === dia).sort((a, b) => a.inicio.localeCompare(b.inicio)),
  })).filter((g) => g.clases.length > 0);
}
