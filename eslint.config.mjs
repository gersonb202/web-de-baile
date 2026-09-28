// @ts-check
import pluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  // TypeScript files — strict + stylistic type-checked
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Astro files
  ...pluginAstro.configs['flat/recommended'],
  // Custom rules
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // El tipado de expresiones JSX de Astro no se resuelve en ESLint (devuelven
  // `error` type en `.map()` dentro de plantillas); `astro check` ya valida los tipos.
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  // TypeScript no resuelve imports `.astro` desde archivos `.ts` (solo `astro check` lo hace),
  // así que los tests con Container API ven el componente como tipo `error`.
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  // Global ignores
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
];
