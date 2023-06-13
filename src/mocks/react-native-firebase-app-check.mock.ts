export const mockReactNativeFirebase = {
  firebase: {
    appCheck: jest.fn(() => ({
      activate: jest.fn(),
      getToken: jest.fn()
    }))
  }
};

jest.mock('@react-native-firebase/app-check', () => mockReactNativeFirebase);
