const XPATH_PATTERN = /^(xpath=|\.?\/\/)/;

function getStaticStringValue(node) {
  if (!node) {
    return undefined;
  }
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis.map(quasi => quasi.value.cooked).join('');
  }
  return undefined;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow XPath selectors anywhere in the framework.'
    },
    schema: [],
    messages: {
      noXpathSelectors: 'XPath selectors are not allowed. Use a Playwright locator engine (getByTestId/getByRole/CSS) instead.'
    }
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== 'MemberExpression' || callee.property.type !== 'Identifier' || callee.property.name !== 'locator') {
          return;
        }

        const [firstArg] = node.arguments;
        const value = getStaticStringValue(firstArg);
        if (value !== undefined && XPATH_PATTERN.test(value.trim())) {
          context.report({ node: firstArg, messageId: 'noXpathSelectors' });
        }
      }
    };
  }
};
