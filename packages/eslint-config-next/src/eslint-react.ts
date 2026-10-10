import type { ESLint } from 'eslint'
import path from 'path'

/**
 * @eslint-react/eslint-plugin is ESM-only, and its `exports` only has an
 * `import` condition, so `require('@eslint-react/eslint-plugin')` fails with
 * ERR_PACKAGE_PATH_NOT_EXPORTED. Requiring its entry file by path loads it
 * through Node.js' `require(esm)`, which is available without a flag since
 * Node.js 22.12.0.
 *
 * Node.js shares ES modules between `require()` and `import`, so this is the
 * same plugin object that users get when importing the plugin themselves.
 * ESLint rejects two different objects registered under the same plugin name,
 * so this keeps combining this config with the plugin's own configs (e.g.
 * `eslintReact.configs['recommended-typescript']`) working.
 */
function loadEslintReact(): ESLint.Plugin {
  const packageJsonPath = require.resolve(
    '@eslint-react/eslint-plugin/package.json'
  )
  const { exports } = require(packageJsonPath)
  return require(path.join(path.dirname(packageJsonPath), exports['.'].import))
    .default
}

export const eslintReact = loadEslintReact()
