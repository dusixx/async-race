/* eslint-env node */
export default {
  '*': ['npm run format'],
  '*.{js,ts}': ['npm run lint:fix'],
  '*.{scss,css}': ['npm run stylelint:fix'],
};
