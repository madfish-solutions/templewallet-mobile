jest.mock('react-native-bootsplash', () => ({
  ...jest.requireActual('react-native-bootsplash'),
  hide: jest.fn(),
  show: jest.fn()
}));
