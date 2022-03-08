import * as Keychain from 'react-native-keychain';
import { BehaviorSubject, of } from 'rxjs';

import { mockHdAccount } from '../interfaces/account.interface.mock';
import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { biometryKeychainOptions } from '../utils/keychain.utils';

export const mockRevealedSecretKey = 'mockRevealedSecretKey';
export const mockRevealedSeedPhrase = 'mockRevealedSeedPhrase';

export const mockShelter = {
  lockApp: jest.fn(() => {
    mockShelter.isLocked$.next(true);
  }),
  getBiometryPassword: jest.fn(() => Keychain.getGenericPassword(biometryKeychainOptions)),
  isLocked$: new BehaviorSubject<boolean>(true),
  getIsLocked: () => true,
  unlockApp$: jest.fn((password: string) => {
    const isCorrectPassword = password === mockCorrectPassword;
    mockShelter.isLocked$.next(!isCorrectPassword);

    return of(isCorrectPassword);
  }),
  verifyPassword$: jest.fn((password: string) => {
    const isCorrectPassword = password === mockCorrectPassword;

    return of(isCorrectPassword);
  }),
  importHdAccount$: jest.fn(() => of([mockHdAccount])),
  enableBiometryPassword$: jest.fn((password: string) => of(password === mockCorrectPassword)),
  createHdAccount$: jest.fn(() => of(mockHdAccount)),
  revealSecretKey$: jest.fn(() => of(mockRevealedSecretKey)),
  revealSeedPhrase$: jest.fn(() => of(mockRevealedSeedPhrase)),
  isPasswordCorrect: jest.fn(async (password: string) => password === mockCorrectPassword),
  createImportedAccount$: jest.fn(() => of(mockHdAccount))
};

jest.mock('./shelter', () => ({
  Shelter: mockShelter
}));
