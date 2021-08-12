import Keychain from 'react-native-keychain';

export const mockIncorrectUserCredentials = undefined;
export const mockCorrectUserCredentials: Keychain.UserCredentials = {
  username: 'mockUsername',
  password: 'mockCorrectPassword',
  service: 'mockService',
  storage: 'mockStorage'
};

export const mockKeychain = {
  ...jest.requireActual('react-native-keychain'),
  getGenericPassword: jest.fn()
};

jest.mock('react-native-keychain', () => mockKeychain);
