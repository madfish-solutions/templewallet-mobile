export const mockReactNativeWebView = {
  default: () => jest.fn()
};

jest.mock('react-native-webview', () => mockReactNativeWebView);
