export const mockReactNativeCloudFs = {
  ...jest.requireActual('react-native-cloud-fs'),
  loginIfNeeded: jest.fn(() => Promise.resolve())
};

jest.mock('react-native-cloud-fs', () => mockReactNativeCloudFs);
