import { of } from 'rxjs';

import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';

export const mockEncryptedData = 'mockEncryptedData';

const mockIncorrectDecryptResult = undefined;
export const mockCorrectDecryptResult = 'mockCorrectDecryptResult';

export const mockCryptoUtil = {
  generateRandomValues: jest.fn(),
  encryptString$: jest.fn(() => of(mockEncryptedData)),
  withEncryptedPass$: jest.fn((keychain, password: string) => of([mockEncryptedData, password])),
  hashPassword$: jest.fn(() => of(mockCorrectPassword)),
  decryptString$: jest.fn((_: unknown, password: string) =>
    Promise.resolve(password === mockCorrectPassword ? mockCorrectDecryptResult : mockIncorrectDecryptResult)
  )
};

jest.mock('./crypto.util', () => mockCryptoUtil);
