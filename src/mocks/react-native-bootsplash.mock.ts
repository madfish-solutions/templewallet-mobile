export const mockReactNativeBootsplash = {
  ...jest.requireActual('react-native-bootsplash'),
  hide: jest.fn()
};

jest.mock('react-native-bootsplash', () => mockReactNativeBootsplash);
