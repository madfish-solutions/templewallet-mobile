import * as Keychain from 'react-native-keychain';
import { BehaviorSubject, of } from 'rxjs';

import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { biometryKeychainOptions } from '../utils/keychain.utils';

export const mockShelter = {
  lockApp: jest.fn(() => {
    mockShelter.isLocked$.next(true);
  }),
  getBiometryPassword: jest.fn(() => Keychain.getGenericPassword(biometryKeychainOptions)),
  isLocked$: new BehaviorSubject<boolean>(true),
  unlockApp$: jest.fn((password: string) => {
    const isCorrectPassword = password === mockCorrectPassword;
    mockShelter.isLocked$.next(!isCorrectPassword);

    return of(isCorrectPassword);
  })
};

jest.mock('./shelter', () => ({
  Shelter: mockShelter
}));
