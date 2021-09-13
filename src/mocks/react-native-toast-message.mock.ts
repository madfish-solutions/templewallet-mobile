export const mockReactNativeToastMessage = {
  show: jest.fn()
};

jest.mock('react-native-toast-message', () => mockReactNativeToastMessage);
