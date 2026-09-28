import { describe, expect, it } from 'vitest';
import { agruparPorDia, construirRejilla, DIAS, type Clase } from '@/lib/horarios';

function clase(id: string, dia: Clase['dia'], inicio: string): Clase {
  return { id, dia, inicio, fin: '23:00', baile: 'salsa', nivel: 'todos', profesor: 'Ana' };
}

const clases = [
  clase('c', 'miercoles', '20:00'),
  clase('a', 'lunes', '19:00'),
  clase('b', 'lunes', '20:00'),
  clase('d', 'lunes', '10:00'),
];

describe('construirRejilla', () => {
  const rejilla = construirRejilla(clases);

  it('ordena las horas de forma ascendente sin repetirlas', () => {
    expect(rejilla.map((f) => f.hora)).toEqual(['10:00', '19:00', '20:00']);
  });

  it('coloca cada clase en su día y hora', () => {
    const fila20 = rejilla.find((f) => f.hora === '20:00');
    expect(fila20?.celdas[DIAS.indexOf('lunes')]?.map((c) => c.id)).toEqual(['b']);
    expect(fila20?.celdas[DIAS.indexOf('miercoles')]?.map((c) => c.id)).toEqual(['c']);
  });

  it('deja celdas vacías donde no hay clase', () => {
    const fila10 = rejilla.find((f) => f.hora === '10:00');
    expect(fila10?.celdas).toHaveLength(DIAS.length);
    expect(fila10?.celdas[DIAS.indexOf('martes')]).toEqual([]);
  });

  it('devuelve una rejilla vacía sin clases', () => {
    expect(construirRejilla([])).toEqual([]);
  });
});

describe('agruparPorDia', () => {
  const grupos = agruparPorDia(clases);

  it('omite los días sin clases', () => {
    expect(grupos.map((g) => g.dia)).toEqual(['lunes', 'miercoles']);
  });

  it('ordena por hora dentro de cada día', () => {
    expect(grupos[0]?.clases.map((c) => c.id)).toEqual(['d', 'a', 'b']);
  });
});
