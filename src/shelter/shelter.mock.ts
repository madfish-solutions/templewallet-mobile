import Keychain from 'react-native-keychain';
import { BehaviorSubject, of } from 'rxjs';

import { mockHdAccount } from '../interfaces/account.interface.mock';
import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { getBiometryKeychainOptions } from '../utils/keychain.utils';

export const mockRevealedSecretKey = 'mockRevealedSecretKey';
export const mockRevealedSeedPhrase = 'mockRevealedSeedPhrase';

const migrateFromSamsungOrGoogleChip$ = jest.fn(() => of(undefined));

export const mockShelter = {
  migrateFromSamsungOrGoogleChip$,
  migrations: [migrateFromSamsungOrGoogleChip$],
  targetShelterVersion: 1,
  getShelterVersion: jest.fn(() => Promise.resolve(0)),
  setShelterVersion: jest.fn(() => Promise.resolve()),
  lockApp: jest.fn(() => {
    mockShelter.isLocked$.next(true);
  }),
  getBiometryPassword: jest.fn(() => Keychain.getGenericPassword(getBiometryKeychainOptions(0))),
  shouldDoSomeMigrations: jest.fn(() => Promise.resolve(true)),
  isLocked$: new BehaviorSubject<boolean>(true),
  getIsLocked: () => true,
  unlockApp$: jest.fn((password: string) => {
    const isCorrectPassword = password === mockCorrectPassword;
    mockShelter.isLocked$.next(!isCorrectPassword);

    return of(isCorrectPassword);
  }),
  importHdAccount$: jest.fn(() => of([mockHdAccount])),
  enableBiometryPassword$: jest.fn((password: string) => of(password === mockCorrectPassword)),
  createHdAccount$: jest.fn(() => of(mockHdAccount)),
  revealSecretKey$: jest.fn(() => of(mockRevealedSecretKey)),
  revealSeedPhrase$: jest.fn(() => of(mockRevealedSeedPhrase)),
  isPasswordCorrect$: jest.fn((password: string) => of(password === mockCorrectPassword)),
  createImportedAccount$: jest.fn(() => of(mockHdAccount)),
  doMigrations$: jest.fn(() => of(undefined))
};

jest.mock('./shelter', () => ({
  Shelter: mockShelter
}));
