module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off'
  }
}
