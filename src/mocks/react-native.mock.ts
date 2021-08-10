export const mockDeviceEventEmitter = {
  addListener: jest.fn(),
  removeListener: jest.fn()
};

jest.mock('react-native', () => ({
  DeviceEventEmitter: mockDeviceEventEmitter
}));
