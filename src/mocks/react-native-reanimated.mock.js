global.__reanimatedWorkletInit = jest.fn();

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.addWhitelistedUIProps = jest.fn();

  return Reanimated;
});
