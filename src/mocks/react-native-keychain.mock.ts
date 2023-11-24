import Keychain from 'react-native-keychain';

export const mockCorrectPassword = 'mockCorrectPassword';
export const mockCorrectUserCredentialsValue = 'mockCorrectUserCredentials';
export const mockCorrectUserCredentials = {
  username: 'mockUsername',
  password: JSON.stringify(mockCorrectUserCredentialsValue),
  service: 'mockService',
  storage: 'mockStorage'
};

export const mockKeychain = {
  ...jest.requireActual('react-native-keychain'),
  getGenericPassword: jest.fn(() => Promise.resolve<Keychain.UserCredentials>(mockCorrectUserCredentials)),
  setGenericPassword: jest.fn(() => Promise.resolve()),
  getSupportedBiometryType: jest.fn(() => Promise.resolve('FaceID')),
  resetGenericPassword: jest.fn(() => Promise.resolve()),
  getAllGenericPasswordServices: jest.fn(() => Promise.resolve(['mockService']))
};

jest.mock('react-native-keychain', () => mockKeychain);
