export default {
  '*.ts': ['eslint --fix', 'prettier --write', () => 'tsc --noEmit'],
  '*.{js,mjs,json,md,yml,yaml}': ['prettier --write']
};
