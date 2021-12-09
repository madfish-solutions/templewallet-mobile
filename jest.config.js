process.env.TZ = 'UTC';
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@react-native|react-native|react-navigation|@react-navigation/.*|lodash-es|@sentry/.*))'
  ],
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-date-mock'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/mocks/svg.mock.js'
  },
  timers: 'legacy'
};
