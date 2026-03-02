const mockReactNativeFs = {
  readFile: jest.fn()
};

jest.mock('react-native-fs', () => mockReactNativeFs);
