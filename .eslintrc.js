module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    "ecmaVersion": 6,
    parser: 'babel-eslint'
  },
  extends: [
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': 'off'
  }
}
