const LOCATOR_METHODS = new Set([
  'locator',
  'frameLocator',
  'getByTestId',
  'getByRole',
  'getByText',
  'getByLabel',
  'getByPlaceholder',
  'getByAltText',
  'getByTitle'
]);

const ALLOWED_PATH_PATTERN = /[\\/](selectors|components)[\\/]|\.selectors\.ts$|\.component\.ts$/;

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow building Playwright locators outside *.selectors.ts and *.component.ts files.'
    },
    schema: [],
    messages: {
      noSelectorsOutsideFile:
        'Locators must be defined in a *.selectors.ts (or *.component.ts) file, not here. Add this locator to the matching selectors/component class and expose it as a property instead.'
    }
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (ALLOWED_PATH_PATTERN.test(filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier' && LOCATOR_METHODS.has(callee.property.name)) {
          context.report({ node: callee.property, messageId: 'noSelectorsOutsideFile' });
        }
      }
    };
  }
};
