export const mockDeviceEventEmitter = {
  addListener: jest.fn(),
  removeListener: jest.fn()
};

export const mockLinking = {
  canOpenURL: jest.fn(() => Promise.resolve()),
  openURL: jest.fn(() => Promise.resolve())
};

jest.mock('react-native', () => ({
  DeviceEventEmitter: mockDeviceEventEmitter,
  Linking: mockLinking
}));
