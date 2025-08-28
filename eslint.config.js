import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['scripts/new-post.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/assets/giscus.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Ignore config files
    ignores: ['*.config.js', '*.config.mjs', '*.config.cjs', 'dist/', '.astro/'],
  }
);
