jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn()
}));
