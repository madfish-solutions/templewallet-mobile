export const mockReactNativeToastMessage = {
  show: jest.fn(),
  hide: jest.fn()
};

jest.mock('react-native-toast-message', () => mockReactNativeToastMessage);
