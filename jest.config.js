process.env.TZ = 'UTC';
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@react-native|react-native|react-navigation|@react-navigation/.*|lodash-es|@sentry/.*))'
  ],
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-date-mock'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/mocks/svg.mock.js'
  },
  timers: 'fake'
};
