export const mockReactNativeBootsplash = {
  ...jest.requireActual('react-native-bootsplash'),
  hide: jest.fn(),
  show: jest.fn()
};

jest.mock('react-native-bootsplash', () => mockReactNativeBootsplash);
