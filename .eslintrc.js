module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended'
  ],
  plugins: ['@typescript-eslint', 'import', 'jest'],
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'newline-before-return': ['error'],
    'comma-dangle': ['error', 'never'],
    'no-void': 'off',
    'no-shadow': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: 'react|react-native',
            group: 'external',
            position: 'before'
          }
        ],
        groups: [['external', 'builtin'], 'internal', ['parent', 'sibling', 'index']],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        'newlines-between': 'always'
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  globals: {
    localStorage: true,
    crypto: true,
    atob: true,
    btoa: true
  }
};
