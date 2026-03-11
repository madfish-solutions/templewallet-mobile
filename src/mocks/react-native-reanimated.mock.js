global.__reanimatedWorkletInit = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.addWhitelistedUIProps = jest.fn();

  return Reanimated;
});
