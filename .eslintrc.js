module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  plugins: ['jest', 'import'],
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-void': 'off',
    'react-hooks/exhaustive-deps': 'off',
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
    ]
  },
  globals: {
    localStorage: true,
    crypto: true,
    atob: true,
    btoa: true
  }
};
