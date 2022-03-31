export const mockDeviceEventEmitterInstance = {
  remove: jest.fn()
};

export const mockDeviceEventEmitter = {
  addListener: jest.fn(() => mockDeviceEventEmitterInstance)
};

export const mockLinking = {
  canOpenURL: jest.fn(() => Promise.resolve()),
  openURL: jest.fn(() => Promise.resolve()),
  addEventListener: jest.fn(() => ({
    remove: jest.fn()
  }))
};

jest.mock('react-native', () => ({
  DeviceEventEmitter: mockDeviceEventEmitter,
  Linking: mockLinking
}));
