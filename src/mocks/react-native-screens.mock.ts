const mockReactNativeScreens = {
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn()
};

jest.mock('react-native-screens', () => mockReactNativeScreens);
