/* eslint-disable jest/no-commented-out-tests */

/*
  Currently, we need a patch, preventing Jest from crashing tests when rejected Promise is not handled.
  It is applied in `postinstall.sh` script.

  ### Example:
  ```ts
  it('should succeed, but crashes', async () => {
    Promise.reject(); // Normally such code does not crash entire runtime
    await new Promise(r => setImmediate(r));
    expect('42').toEqual('42');
  })
  ```

  See:
  - https://github.com/jestjs/jest/issues/11165
  - https://github.com/nodejs/node/issues/20392
  - https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode
*/

process.env.TZ = 'UTC';
process.env.LANG = 'en_GB.UTF-8';

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@react-native|react-native|react-native-themis|react-navigation|@react-navigation/.*|rxjs|lodash-es|@sentry/.*))'
  ],
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-date-mock'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '\\.svg': '<rootDir>/src/mocks/svg.mock.js',
    '^react-native-themis': '<rootDir>/node_modules/react-native-themis/src/index.js',
    '^@stablelib/wipe$': '<rootDir>/src/mocks/stablelib/wipe.mock.ts',
    '^@stablelib/nacl$': '<rootDir>/src/mocks/stablelib/nacl.mock.ts',
    '^@stablelib/random$': '<rootDir>/src/mocks/stablelib/random.mock.ts',
    '^@stablelib/utf8$': '<rootDir>/src/mocks/stablelib/utf8.mock.ts',
    '^@stablelib/ed25519$': '<rootDir>/src/mocks/stablelib/ed25519.mock.ts',
    '^@stablelib/bytes$': '<rootDir>/src/mocks/stablelib/bytes.mock.ts',
    '^@stablelib/x25519-session$': '<rootDir>/src/mocks/stablelib/x25519-session.mock.ts'
  }
};
