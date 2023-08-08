export const mockReactNativeFirebaseMessaging = {
  messaging: jest.fn(() => ({
    getToken: jest.fn(),
    registerDeviceForRemoteMessages: jest.fn(),
    onMessage: jest.fn()
  }))
};

export const mockReactNativeFirebaseAppCheck = {
  firebase: {
    appCheck: jest.fn(() => ({
      activate: jest.fn(),
      getToken: jest.fn()
    }))
  }
};

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/messaging', () => mockReactNativeFirebaseMessaging);

jest.mock('@react-native-firebase/app-check', () => mockReactNativeFirebaseAppCheck);
