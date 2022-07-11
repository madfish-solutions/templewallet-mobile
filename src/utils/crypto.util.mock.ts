import { of } from 'rxjs';

import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';

export const mockCorrectPasswordHash = 'mockCorrectPassword_HASH';

export const mockEncryptedData = 'mockEncryptedData';

const mockIncorrectDecryptResult = undefined;
export const mockCorrectDecryptResult = 'mockCorrectDecryptResult';

export const mockCryptoUtil = {
  encryptString$: jest.fn(() => of(mockEncryptedData)),
  hashPassword$: jest.fn((input: string) =>
    of(input === mockCorrectPassword ? mockCorrectPasswordHash : `${input}_HASH`)
  ),
  decryptString$: jest.fn((_: unknown, passwordHash: string) =>
    Promise.resolve(passwordHash === mockCorrectPasswordHash ? mockCorrectDecryptResult : mockIncorrectDecryptResult)
  )
};

jest.mock('./crypto.util', () => mockCryptoUtil);
