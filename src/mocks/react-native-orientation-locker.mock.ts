const mockReactNativeOrientationLocker = {
  useOrientationChange: jest.fn(),
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn()
};

jest.mock('react-native-orientation-locker', () => mockReactNativeOrientationLocker);
