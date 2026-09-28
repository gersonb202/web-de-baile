import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const BAILES = ['salsa', 'bachata', 'breakdance', 'zumba', 'kizomba'] as const;
export const DIAS = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const;

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM');

const bailes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/bailes' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      resumen: z.string().max(160),
      seoTitle: z.string().max(60),
      seoDescription: z.string().max(155),
      portada: image(),
      portadaAlt: z.string().min(5),
      niveles: z.array(z.enum(['iniciacion', 'intermedio', 'avanzado'])),
      orden: z.number(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70),
      description: z.string().max(155),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string().min(5),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const profesores = defineCollection({
  loader: file('./src/data/profesores.json'),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      especialidad: z.string(),
      foto: image(),
      bio: z.string().max(300).optional(),
    }),
});

const horarios = defineCollection({
  loader: file('./src/data/horarios.json'),
  schema: z.object({
    dia: z.enum(DIAS),
    inicio: hora,
    fin: hora,
    baile: z.enum(BAILES),
    nivel: z.enum(['iniciacion', 'intermedio', 'avanzado', 'todos']),
    profesor: reference('profesores'),
    sala: z.string().optional(),
  }),
});

const testimonios = defineCollection({
  loader: file('./src/data/testimonios.json'),
  schema: z.object({
    autor: z.string(),
    texto: z.string().max(280),
    baile: z.enum(BAILES).optional(),
    valoracion: z.number().int().min(1).max(5),
    fuente: z.enum(['google', 'directo']).default('directo'),
  }),
});

const faq = defineCollection({
  loader: file('./src/data/faq.json'),
  schema: z.object({
    pregunta: z.string(),
    respuesta: z.string(),
    categoria: z.enum(['general', 'clases', 'precios', 'reserva']),
    orden: z.number(),
  }),
});

const precios = defineCollection({
  loader: file('./src/data/precios.json'),
  schema: z.object({
    nombre: z.string(),
    clasesSemana: z.string(),
    precioMensual: z.number().nonnegative(),
    incluye: z.array(z.string()).min(1),
    recomendado: z.boolean().default(false),
    matricula: z.string(),
    permanencia: z.string(),
    orden: z.number(),
  }),
});

const servicios = defineCollection({
  loader: file('./src/data/servicios.json'),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    paraQuien: z.string(),
    duracion: z.string(),
    precioOrientativo: z.string(),
    mensajeWhatsApp: z.string(),
    orden: z.number(),
  }),
});

export const collections = {
  bailes,
  blog,
  profesores,
  horarios,
  testimonios,
  faq,
  precios,
  servicios,
};
