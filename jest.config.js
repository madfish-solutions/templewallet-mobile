process.env.TZ = 'UTC';
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@react-native|react-native|react-native-themis|react-navigation|@react-navigation/.*|lodash-es|@sentry/.*))'
  ],
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-date-mock'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/mocks/svg.mock.js',
    "^react-native-themis": "<rootDir>/node_modules/react-native-themis/src/index.js"
  },
  timers: 'legacy'
};
