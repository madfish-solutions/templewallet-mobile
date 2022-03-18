import { of } from 'rxjs';

import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';

export const mockEncryptedData = 'mockEncryptedData';

const mockIncorrectDecryptResult = undefined;
export const mockCorrectDecryptResult = 'mockCorrectDecryptResult';

export const mockCryptoUtil = {
  encryptString$: jest.fn((_value: string, _password: string) => of(mockEncryptedData)),
  decryptString$: jest.fn((_: unknown, password: string) =>
    Promise.resolve(password === mockCorrectPassword ? mockCorrectDecryptResult : mockIncorrectDecryptResult)
  )
};

jest.mock('./crypto.util', () => mockCryptoUtil);
