import type { ESLint, Linter } from 'eslint'

// plugins
import next from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import tsEslint from 'typescript-eslint'
// import * as ... for plugins without default export
import * as importPlugin from 'eslint-plugin-import'
import * as jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

// utils
import globals from 'globals'
import eslintParser from './parser'
import { eslintReact } from './eslint-react'
import { plugin } from './plugin'
import { fixupPluginRules } from './rule-context'

const config: Linter.Config[] = [
  {
    name: 'next',
    // Default files, users can overwrite this.
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    plugins: {
      '@eslint-react': eslintReact,
      // The plugin's nested `configs.flat` doesn't match `ESLint.Plugin`.
      'react-hooks': reactHooks as ESLint.Plugin,
      import: fixupPluginRules(importPlugin),
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': next,
      'eslint-config-next': plugin,
    },
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        // TODO: Is this needed?
        babelOptions: {
          presets: ['next/babel'],
          caller: {
            // Eslint supports top level await when a parser for it is included. We enable the parser by default for Babel.
            supportsTopLevelAwait: true,
          },
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.mts', '.cts', '.tsx', '.d.ts'],
      },
      // eslint-plugin-import loads resolvers by name from the linted file,
      // which fails when the package manager doesn't hoist them (e.g. npm
      // nests them here when a plugin's ESLint peer range isn't satisfied).
      'import/resolver': {
        [require.resolve('eslint-import-resolver-node')]: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        [require.resolve('eslint-import-resolver-typescript')]: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // The @eslint-react/eslint-plugin equivalents of the eslint-plugin-react
      // rules this config used to enable. eslint-plugin-react's
      // `jsx-no-duplicate-props`, `jsx-no-undef`, `no-is-mounted`,
      // `no-string-refs`, `no-unescaped-entities` and `require-render-return`
      // have none.
      // react/display-name
      '@eslint-react/no-missing-component-display-name': 'error',
      // react/jsx-key
      '@eslint-react/no-missing-key': 'error',
      // react/jsx-no-comment-textnodes
      '@eslint-react/jsx-no-comment-textnodes': 'error',
      // react/no-children-prop
      '@eslint-react/jsx-no-children-prop': 'error',
      // react/no-danger-with-children
      '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error',
      // react/no-deprecated
      '@eslint-react/no-component-will-mount': 'error',
      '@eslint-react/no-component-will-receive-props': 'error',
      '@eslint-react/no-component-will-update': 'error',
      '@eslint-react/dom-no-hydrate': 'error',
      '@eslint-react/dom-no-render': 'error',
      // react/no-direct-mutation-state
      '@eslint-react/no-direct-mutation-state': 'error',
      // react/no-find-dom-node
      '@eslint-react/dom-no-find-dom-node': 'error',
      // react/no-render-return-value
      '@eslint-react/dom-no-render-return-value': 'error',
      // react/jsx-uses-react and react/jsx-uses-vars
      'eslint-config-next/jsx-uses-react': 'error',
      'eslint-config-next/jsx-uses-vars': 'error',
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      'import/no-anonymous-default-export': 'warn',
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
    },
  },
  {
    name: 'next/typescript',
    // Default files, users can overwrite this.
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  // Global ignores, users can add more `ignores` or overwrite this by `!<ignore>`.
  {
    ignores: [
      // node_modules/ and .git/ are ignored by default.
      // https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

// Use `export =` instead of `export default` for ESLint parser compatibility.
// ESLint expects parser modules to be directly importable as CommonJS modules (module.exports).
export = config
