import { getCollection } from 'astro:content';
import type { Clase } from '@/lib/horarios';

/** Carga los horarios y resuelve el nombre del profesor. Filtra por baile (slug) si se indica. */
export async function getClases(baile?: string): Promise<Clase[]> {
  const [horarios, profesores] = await Promise.all([
    getCollection('horarios'),
    getCollection('profesores'),
  ]);
  const nombres = new Map(profesores.map((p) => [p.id, p.data.nombre]));

  return horarios
    .filter((h) => baile === undefined || h.data.baile === baile)
    .map((h) => ({
      id: h.id,
      dia: h.data.dia,
      inicio: h.data.inicio,
      fin: h.data.fin,
      baile: h.data.baile,
      nivel: h.data.nivel,
      profesor: nombres.get(h.data.profesor.id) ?? h.data.profesor.id,
      sala: h.data.sala,
    }));
}
