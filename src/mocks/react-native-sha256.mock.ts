const mockReactNativeSha256 = {
  sha256: jest.fn()
};

jest.mock('react-native-sha256', () => mockReactNativeSha256);
