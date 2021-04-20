jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.addWhitelistedUIProps = () => {};

  return Reanimated;
});
