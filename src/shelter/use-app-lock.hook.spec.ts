import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { CONSTANT_DELAY_TIME, RANDOM_DELAY_TIME } from '../config/security';
import { mockCorrectPassword, mockCorrectUserCredentialsValue } from '../mocks/react-native-keychain.mock';
import { mockReactNativeToastMessage } from '../mocks/react-native-toast-message.mock';
import { mockUseDispatch } from '../mocks/react-redux.mock';
import { mockShelter } from './shelter.mock';
import { useAppLock } from './use-app-lock.hook';

const BRUTEFORCE_LOCK_TIME = RANDOM_DELAY_TIME + CONSTANT_DELAY_TIME;

describe('useAppLock', () => {
  beforeEach(() => {
    mockShelter.unlockApp$.mockClear();
    mockUseDispatch.mockClear();
    mockShelter.getBiometryPassword.mockClear();
  });

  describe('initial state', () => {
    it('should be locked on start by default', () => {
      const { result } = renderHook(() => useAppLock());

      expect(result.current.isLocked).toEqual(true);
    });

    it('should be unlocked if shelter is unlocked', () => {
      const { result } = renderHook(() => useAppLock());

      act(() => mockShelter.isLocked$.next(false));

      expect(result.current.isLocked).toEqual(false);
    });
  });

  describe('password authentication', () => {
    it('should unlock if a correct password is given', () => {
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.unlock(mockCorrectPassword));

      setTimeout(() => {
        expect(result.current.isLocked).toEqual(false);
        expect(mockShelter.unlockApp$).toBeCalledWith(mockCorrectPassword);
      }, BRUTEFORCE_LOCK_TIME);
    });

    it('should show error toast if an incorrect password is given', () => {
      const mockIncorrectPassword = 'mockIncorrectPassword';
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.unlock(mockIncorrectPassword));

      setTimeout(() => {
        expect(result.current.isLocked).toEqual(true);
        expect(mockShelter.unlockApp$).toBeCalledWith(mockIncorrectPassword);
        expect(mockReactNativeToastMessage.show).toBeCalled();
      }, BRUTEFORCE_LOCK_TIME);
    });
  });

  describe('biometry authentication', () => {
    it('should unlock if biometry authentication passes', async () => {
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(mockShelter.getBiometryPassword).toBeCalled();
      setTimeout(
        () => expect(mockShelter.unlockApp$).toBeCalledWith(mockCorrectUserCredentialsValue),
        BRUTEFORCE_LOCK_TIME
      );
    });

    it('should do nothing if biometry authentication fails', async () => {
      mockShelter.getBiometryPassword.mockRejectedValueOnce(new Error('Mock error'));
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(mockShelter.getBiometryPassword).toBeCalled();
      expect(mockShelter.unlockApp$).not.toBeCalled();
    });
  });

  describe('lock', () => {
    beforeEach(() => {
      mockShelter.lockApp.mockReset();
    });

    it('should be able to lock', async () => {
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.lock());

      expect(mockShelter.lockApp).toBeCalled();
      setTimeout(() => expect(result.current.isLocked).toEqual(true), BRUTEFORCE_LOCK_TIME);
    });
  });
});
