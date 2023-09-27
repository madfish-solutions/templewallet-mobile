export {};

jest.mock('react-native-webview', () => {
  const { View } = jest.requireActual('react-native');

  return {
    WebView: View
  };
});
