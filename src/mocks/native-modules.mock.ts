import { NativeModules } from 'react-native';

export const mockPbkdf2Key = 'pbkdf2Key';

export const mockNativeAes = {
  pbkdf2: jest.fn(() => Promise.resolve(mockPbkdf2Key))
};

NativeModules.RNPermissions = {};
NativeModules.Aes = mockNativeAes;
