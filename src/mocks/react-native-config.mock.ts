export {};

// See: https://github.com/lugg/react-native-config?tab=readme-ov-file#testing
jest.mock('react-native-config', () => jest.requireActual('react-native-config-node'));
