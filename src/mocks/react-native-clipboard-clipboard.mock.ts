export const mockReactNativeClipboard = {
  setString: jest.fn()
};

jest.mock('@react-native-clipboard/clipboard', () => mockReactNativeClipboard);
