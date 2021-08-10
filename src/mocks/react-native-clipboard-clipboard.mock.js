jest.mock('@react-native-clipboard/clipboard', () => ({
  ...jest.requireActual('@react-native-clipboard/clipboard'),
  setString: jest.fn()
}));
