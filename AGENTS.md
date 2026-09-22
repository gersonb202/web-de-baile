# AGENTS.md

> Manual operativo para cualquier agente de IA o desarrollador que trabaje en este repositorio.
> Antes de hacer **cualquier cambio**, lee [`docs/constitution.md`](docs/constitution.md). Sus reglas tienen prioridad sobre este archivo.

---

## Proyecto

Web estática (SSG) de una escuela de baile. **Objetivo de negocio único: que el visitante reserve una clase gratuita por WhatsApp.** Todo el sitio empuja hacia esa conversión.

### Documentación clave

| Documento | Propósito |
|---|---|
| [`guia.md`](guia.md) | Guía completa de arquitectura, implementación y buenas prácticas |
| [`docs/constitution.md`](docs/constitution.md) | Principios no negociables del proyecto |
| [`specs/spec.md`](specs/spec.md) | Especificación técnica detallada (SDD) |

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro ^7.3.4 (salida 100% estática) |
| Lenguaje | TypeScript estricto (`astro/tsconfigs/strictest`) |
| Estilos | TailwindCSS v4 (plugin de Vite) |
| Imágenes | Sharp (AVIF/WebP automático vía `astro:assets`) |
| Contenido | Content Collections + Zod |
| Tests unitarios | Vitest |
| Tests E2E + a11y | Playwright + `@axe-core/playwright` |
| Calidad | ESLint (`eslint-plugin-astro`), Prettier, `astro check` |
| CI | GitHub Actions |
| Cookies | `vanilla-cookieconsent` |
| Vídeos | `@astro-community/astro-embed-youtube` (fachada) |

---

## Comandos

| Acción | Comando |
|---|---|
| Desarrollo | `npm run dev` |
| Build (incluye `astro check`) | `npm run build` |
| Previsualizar build | `npm run preview` |
| Comprobar tipos Astro | `npm run check` |
| Lint | `npm run lint` |
| Formato | `npm run format` |
| Comprobar formato | `npm run format:check` |
| Tests unitarios | `npm test` |
| Tests unitarios (watch) | `npm run test:watch` |
| Tests E2E | `npm run test:e2e` |

---

## Estructura del proyecto

```
escuela-baile/
├── public/
│   ├── favicon.svg
│   ├── og-default.jpg              # OG image por defecto (1200×630)
│   └── _headers                    # Cabeceras de seguridad (Netlify/CF Pages)
├── src/
│   ├── assets/                     # Imágenes procesadas por Sharp (NUNCA en public/)
│   │   ├── hero/
│   │   ├── bailes/
│   │   ├── profesores/
│   │   └── blog/
│   ├── components/
│   │   ├── ui/                     # Button, Card, Badge, Container, Section
│   │   ├── layout/                 # Header, Footer, MobileNav, SkipLink, Breadcrumbs, StickyCta
│   │   ├── seo/                    # BaseHead, JsonLd
│   │   ├── sections/               # Hero, Beneficios, Testimonios, Faq, CtaBanner, ComoFunciona
│   │   ├── forms/                  # ReservaForm
│   │   ├── horarios/               # AgendaTabla, AgendaMovil
│   │   └── media/                  # YouTubeFacade, MapaFacade, CookieConsent
│   ├── content/
│   │   ├── blog/                   # Artículos .md/.mdx
│   │   └── bailes/                 # Un .md por baile
│   ├── data/                       # JSON validados con Zod
│   │   ├── horarios.json
│   │   ├── profesores.json
│   │   ├── testimonios.json
│   │   ├── servicios.json
│   │   ├── precios.json
│   │   └── faq.json
│   ├── config/
│   │   └── site.ts                 # FUENTE ÚNICA: nombre, NAP, WhatsApp, redes, URL base
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── lib/                        # Lógica pura y testeable (sin DOM)
│   │   ├── whatsapp.ts
│   │   ├── horarios.ts
│   │   └── schema.ts               # Generadores de JSON-LD
│   ├── pages/                      # Rutas (ver mapa de URLs abajo)
│   ├── styles/
│   │   └── global.css              # Tailwind + tokens de diseño
│   └── content.config.ts           # Esquemas Zod de todas las colecciones
├── tests/
│   ├── unit/                       # Vitest
│   └── e2e/                        # Playwright
├── docs/
│   └── constitution.md
├── specs/
│   └── spec.md
├── .github/workflows/ci.yml
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── AGENTS.md                       # ← Este archivo
└── guia.md
```

### Mapa de URLs

```
/                     Inicio
/bailes               Listado de bailes
/bailes/[slug]        Página individual (salsa, bachata, breakdance, zumba, kizomba)
/servicios            Talleres, eventos, intensivos, particulares
/conocenos            Historia, valores, profesores
/horarios             Agenda semanal
/precios              Tarifas + CTA a /reservar
/blog                 Listado de artículos
/blog/[slug]          Artículo
/faq                  Preguntas frecuentes
/contacto             Mapa, dirección, teléfono
/reservar             Formulario de clase gratuita → WhatsApp
/aviso-legal          LSSI-CE
/privacidad           RGPD
/cookies              Política de cookies
/404                  Página de error útil
```

---

## Convenciones

### Nombrado

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes Astro | `PascalCase.astro` | `ReservaForm.astro` |
| Utilidades TS | `camelCase.ts` | `whatsapp.ts` |
| Rutas y slugs | `kebab-case` | `/bailes/breakdance` |
| Tokens de color | Nombre semántico | `fuego`, `crema`, `oceano`, `cielo`, `noche` |

### Estilos

- **Solo Tailwind** + tokens semánticos definidos en `global.css`.
- Botón principal: **fondo `fuego` + texto `noche`** (nunca texto blanco sobre `fuego` — contraste insuficiente).
- Texto base mínimo: 16 px en móvil.
- Áreas táctiles: ≥ 44×44 px.

### Imágenes

- Siempre en `src/assets/`, nunca en `public/`.
- Siempre con `<Image>` o `<Picture>` de `astro:assets`.
- Siempre con `alt` descriptivo (vacío solo si decorativa).
- Hero: `loading="eager"` + `fetchpriority="high"`. Resto: lazy.

### Contenido

- Los datos viven en `src/content/` (Markdown) y `src/data/` (JSON).
- Validación con Zod en `content.config.ts`. Si falta un campo, el build falla.
- Datos de contacto **solo** desde `src/config/site.ts`.

### Commits

```
feat: añadir página de precios
fix: corregir contraste del botón secondary
docs: actualizar FAQ en data/faq.json
test: añadir test unitario para construirRejilla
refactor: extraer lógica de sanitización
chore: actualizar dependencias
```

---

## Tareas frecuentes

### Añadir un baile

1. Crear `src/content/bailes/<slug>.md` con el frontmatter del esquema.
2. Añadir imagen en `src/assets/bailes/`.
3. Añadir el valor al enum `BAILES` en `content.config.ts`.
4. Añadir la opción al formulario de reserva.

### Añadir un artículo de blog

1. Crear `src/content/blog/<slug>.mdx` con el frontmatter del esquema.
2. Añadir imagen de portada en `src/assets/blog/`.
3. Incluir enlace a `/reservar` en el contenido.

### Añadir un profesor

1. Nueva entrada en `src/data/profesores.json` (con `id` único).
2. Foto en `src/assets/profesores/`.

### Cambiar horarios o precios

- Editar **solo** `src/data/horarios.json` o `src/data/precios.json`.
- Nunca tocar componentes para esto.

### Nuevo script de terceros

1. Solo detrás del consentimiento de cookies (categoría `analytics` o `multimedia`).
2. Actualizar la CSP en `public/_headers`.
3. Documentar en `/cookies`.

---

## Prohibido

- ❌ Usar `any`. Usar `unknown` y estrechar el tipo.
- ❌ Desactivar reglas de lint sin justificación en comentario.
- ❌ Saltarse `astro check`.
- ❌ Añadir frameworks de UI (React, Vue, Svelte) o librerías pesadas sin necesidad aprobada.
- ❌ Cargar YouTube, Google Maps o analítica antes del consentimiento.
- ❌ Escribir teléfono, dirección o WhatsApp directamente en componentes (usar `SITE`).
- ❌ Usar `set:html` o `innerHTML` con contenido no controlado.
- ❌ Guardar secretos o claves en el repositorio.
- ❌ Poner imágenes de contenido en `public/`.
- ❌ Sobre-ingeniería: no añadir CMS, i18n, SSR ni nada que no se necesite *ahora* (YAGNI).

---

## Definición de terminado (DoD)

Todo cambio debe cumplir antes de fusionarse:

- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run check` (`astro check`) pasa sin errores.
- [ ] `npm test` pasa sin errores.
- [ ] `npm run build` genera la build correctamente.
- [ ] Tests nuevos/actualizados para la lógica o comportamiento modificado.
- [ ] Revisado en móvil (375 px) y escritorio (1280 px+).
- [ ] Sin violaciones de axe en las páginas afectadas.
- [ ] Página nueva: `<title>`, `<meta description>`, un único `<h1>`, `<link rel="canonical">` y aparece en el sitemap.
- [ ] Coherente con [`docs/constitution.md`](docs/constitution.md).
- [ ] PR con Conventional Commit y CI en verde.
