module.exports = {
  root: true,
  extends: ['@repo/eslint-config/vue.js', '@repo/eslint-config/vue-playwright.js'],
  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off'
  }
}
