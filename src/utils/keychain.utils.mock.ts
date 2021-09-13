import { mockCorrectDecryptResult } from './crypto.util.mock';

jest.mock('./keychain.utils', () => ({
  ...jest.requireActual('./keychain.utils'),
  APP_IDENTIFIER: mockCorrectDecryptResult
}));
