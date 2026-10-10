import type { ESLint, Rule } from 'eslint'

// ESTree, and therefore ESLint's types, don't include JSX nodes.
interface JSXIdentifier {
  type: 'JSXIdentifier'
  name: string
}
interface JSXMemberExpression {
  type: 'JSXMemberExpression'
  object: JSXIdentifier | JSXMemberExpression
}
interface JSXOpeningElement {
  name: JSXIdentifier | JSXMemberExpression | { type: 'JSXNamespacedName' }
}

const JSX_PRAGMA_REGEX = /@jsx\s+([^\s]+)/
const IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/

function getSetting(context: Rule.RuleContext, name: string) {
  const value = (
    context.settings.react as Record<string, unknown> | undefined
  )?.[name]
  return typeof value === 'string' && IDENTIFIER_REGEX.test(value)
    ? value
    : undefined
}

/**
 * The parser this config uses for JavaScript files doesn't add references for
 * JSX to the scope, so `no-unused-vars` reports components that are only used
 * in JSX. eslint-plugin-react's `react/jsx-uses-vars` rule, which this config
 * used to enable, marks them as used. @eslint-react/eslint-plugin has no
 * equivalent, as the TypeScript parser and ESLint 10's default parser add the
 * references themselves.
 */
const jsxUsesVars: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Mark variables used as JSX element names as used, for `no-unused-vars`.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node: Rule.Node) {
        const { name } = node as unknown as JSXOpeningElement
        let variable: string
        if (name.type === 'JSXIdentifier') {
          // Lowercase names like `<div>` are DOM elements.
          if (/^[a-z]/.test(name.name)) return
          variable = name.name
        } else if (name.type === 'JSXMemberExpression') {
          // `<Foo.Bar.Baz>` and `<motion.div>` use `Foo` and `motion`.
          let { object } = name
          while (object.type === 'JSXMemberExpression') object = object.object
          variable = object.name
        } else {
          // Namespaced names like `<svg:rect>` don't refer to variables.
          return
        }
        context.sourceCode.markVariableAsUsed(variable, node)
      },
    }
  },
}

/**
 * The classic JSX runtime compiles JSX to calls of the JSX pragma (`React`, or
 * the one an `@jsx` comment names), so this marks it as used in files with JSX.
 * Equivalent to eslint-plugin-react's `react/jsx-uses-react` rule, which this
 * config used to enable, including its `react.pragma` and `react.fragment`
 * settings.
 */
const jsxUsesReact: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Mark the JSX pragma (e.g. `React`) as used in files with JSX, for `no-unused-vars`.',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context
    let pragma = getSetting(context, 'pragma') ?? 'React'
    for (const comment of sourceCode.getAllComments()) {
      const match = JSX_PRAGMA_REGEX.exec(comment.value)
      if (match) {
        const name = match[1].split('.')[0]
        pragma = IDENTIFIER_REGEX.test(name) ? name : 'React'
        break
      }
    }
    const fragment = getSetting(context, 'fragment') ?? 'Fragment'

    const markPragmaAsUsed = (node: Rule.Node) => {
      sourceCode.markVariableAsUsed(pragma, node)
    }
    return {
      JSXOpeningElement: markPragmaAsUsed,
      JSXOpeningFragment: markPragmaAsUsed,
      JSXFragment(node: Rule.Node) {
        sourceCode.markVariableAsUsed(fragment, node)
      },
    }
  },
}

/**
 * Rules for this config's own use, registered as the `eslint-config-next`
 * plugin. They don't report anything.
 */
export const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-config-next',
  },
  rules: {
    'jsx-uses-react': jsxUsesReact,
    'jsx-uses-vars': jsxUsesVars,
  },
}
