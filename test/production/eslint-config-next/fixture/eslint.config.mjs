import { defineConfig, globalIgnores } from 'eslint/config'
import eslintReact from '@eslint-react/eslint-plugin'
import nextVitals from 'eslint-config-next/core-web-vitals'

// A JavaScript project, so files are parsed by eslint-config-next's parser.
export default defineConfig([
  globalIgnores(['typescript/**']),
  // Registers the `@eslint-react` plugin a second time, which only works if
  // eslint-config-next uses the same plugin object.
  { plugins: { '@eslint-react': eslintReact } },
  ...nextVitals,
  {
    files: ['lib/**'],
    languageOptions: {
      globals: { configured: 'readonly', disabled: 'off' },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'import/no-default-export': 'error',
    },
  },
  {
    files: ['lib/script.js'],
    languageOptions: {
      sourceType: 'script',
      parserOptions: { sourceType: 'script' },
    },
  },
])
