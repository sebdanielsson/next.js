import { join } from 'path'
import { execSync } from 'child_process'
import { getEslintConfigSnapshot } from '../utils'

// eslint-config-next loads @eslint-react/eslint-plugin, an ES module, with
// `require(esm)`.
// @force-gate node22
describe('eslint-config-next', () => {
  it('should match expected resolved configuration', () => {
    const eslintConfigAfterSetupJSON = execSync(
      // Pass explicit absolute path to not get affected by the root eslint config.
      `pnpm eslint --config ${join(__dirname, 'eslint.config.mjs')} --print-config ${join(__dirname, 'test.js')}`,
      {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'inherit'],
      }
    )

    const { settings, languageOptions, ...eslintConfigAfterSetup } = JSON.parse(
      eslintConfigAfterSetupJSON
    )

    expect({
      parser: languageOptions.parser,
      settings,
    }).toEqual({
      // parser: require.resolve('eslint-config-next')
      parser: expect.stringContaining('eslint-config-next'),
      settings: {
        'import/parsers': expect.any(Object),
        'import/resolver': expect.any(Object),
      },
    })

    expect(getEslintConfigSnapshot(eslintConfigAfterSetup))
      .toMatchInlineSnapshot(`
     {
       "language": "@/js",
       "linterOptions": {
         "reportUnusedDisableDirectives": 1,
       },
       "plugins": [
         "@",
         "@eslint-react:@eslint-react/eslint-plugin@5.24.9",
         "react-hooks:eslint-plugin-react-hooks@7.0.0",
         "import",
         "jsx-a11y:eslint-plugin-jsx-a11y@6.10.2",
         "@next/next:@next/eslint-plugin-next",
         "eslint-config-next:eslint-config-next",
       ],
       "rules": {
         "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": [
           2,
         ],
         "@eslint-react/dom-no-find-dom-node": [
           2,
         ],
         "@eslint-react/dom-no-hydrate": [
           2,
         ],
         "@eslint-react/dom-no-render": [
           2,
         ],
         "@eslint-react/dom-no-render-return-value": [
           2,
         ],
         "@eslint-react/jsx-no-children-prop": [
           2,
         ],
         "@eslint-react/jsx-no-comment-textnodes": [
           2,
         ],
         "@eslint-react/no-component-will-mount": [
           2,
         ],
         "@eslint-react/no-component-will-receive-props": [
           2,
         ],
         "@eslint-react/no-component-will-update": [
           2,
         ],
         "@eslint-react/no-direct-mutation-state": [
           2,
         ],
         "@eslint-react/no-missing-component-display-name": [
           2,
         ],
         "@eslint-react/no-missing-key": [
           2,
         ],
         "@next/next/google-font-display": [
           1,
         ],
         "@next/next/google-font-preconnect": [
           1,
         ],
         "@next/next/inline-script-id": [
           2,
         ],
         "@next/next/next-script-for-ga": [
           1,
         ],
         "@next/next/no-assign-module-variable": [
           2,
         ],
         "@next/next/no-async-client-component": [
           1,
         ],
         "@next/next/no-before-interactive-script-outside-document": [
           1,
         ],
         "@next/next/no-css-tags": [
           1,
         ],
         "@next/next/no-document-import-in-page": [
           2,
         ],
         "@next/next/no-duplicate-head": [
           2,
         ],
         "@next/next/no-head-element": [
           1,
         ],
         "@next/next/no-head-import-in-document": [
           2,
         ],
         "@next/next/no-html-link-for-pages": [
           1,
         ],
         "@next/next/no-img-element": [
           1,
         ],
         "@next/next/no-location-assign-relative-destination": [
           1,
         ],
         "@next/next/no-page-custom-font": [
           1,
         ],
         "@next/next/no-script-component-in-head": [
           2,
         ],
         "@next/next/no-styled-jsx-in-document": [
           1,
         ],
         "@next/next/no-sync-scripts": [
           1,
         ],
         "@next/next/no-title-in-document-head": [
           1,
         ],
         "@next/next/no-typos": [
           1,
         ],
         "@next/next/no-unwanted-polyfillio": [
           1,
         ],
         "eslint-config-next/jsx-uses-react": [
           2,
         ],
         "eslint-config-next/jsx-uses-vars": [
           2,
         ],
         "import/no-anonymous-default-export": [
           1,
         ],
         "jsx-a11y/alt-text": [
           1,
           {
             "elements": [
               "img",
             ],
             "img": [
               "Image",
             ],
           },
         ],
         "jsx-a11y/aria-props": [
           1,
         ],
         "jsx-a11y/aria-proptypes": [
           1,
         ],
         "jsx-a11y/aria-unsupported-elements": [
           1,
         ],
         "jsx-a11y/role-has-required-aria-props": [
           1,
         ],
         "jsx-a11y/role-supports-aria-props": [
           1,
         ],
         "react-hooks/config": [
           2,
         ],
         "react-hooks/error-boundaries": [
           2,
         ],
         "react-hooks/exhaustive-deps": [
           1,
         ],
         "react-hooks/gating": [
           2,
         ],
         "react-hooks/globals": [
           2,
         ],
         "react-hooks/immutability": [
           2,
         ],
         "react-hooks/incompatible-library": [
           1,
         ],
         "react-hooks/preserve-manual-memoization": [
           2,
         ],
         "react-hooks/purity": [
           2,
         ],
         "react-hooks/refs": [
           2,
         ],
         "react-hooks/rules-of-hooks": [
           2,
         ],
         "react-hooks/set-state-in-effect": [
           2,
         ],
         "react-hooks/set-state-in-render": [
           2,
         ],
         "react-hooks/static-components": [
           2,
         ],
         "react-hooks/unsupported-syntax": [
           1,
         ],
         "react-hooks/use-memo": [
           2,
         ],
       },
     }
    `)
  })
})
