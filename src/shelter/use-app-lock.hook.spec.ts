import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { BehaviorSubject } from 'rxjs';

import { mockCorrectPassword, mockKeychain } from '../mocks/react-native-keychain.mock';
import { mockReactNativeToastMessage } from '../mocks/react-native-toast-message.mock';
import { biometryKeychainOptions } from '../utils/keychain.utils';
import { mockShelter } from './shelter.mock';
import { useAppLock } from './use-app-lock.hook';

describe('useAppLock', () => {
  beforeEach(() => {
    mockShelter.isLocked$.next(true);
    mockReactNativeToastMessage.show.mockReset();
    mockShelter.getBiometryPassword.mockReset();
    mockShelter.unlockApp$.mockReset();
  });

  describe('initial state', () => {
    it('should be locked on start by default', () => {
      const { result } = renderHook(() => useAppLock());

      expect(result.current.isLocked).toEqual(true);
    });

    it('should be unlocked if shelter is unlocked on start', () => {
      const { result } = renderHook(() => useAppLock());

      act(() => mockShelter.isLocked$.next(false));

      expect(result.current.isLocked).toEqual(false);
    });
  });

  describe('password authentication', () => {
    it('should unlock if a correct password is given', () => {
      const { result, rerender } = renderHook(() => useAppLock());

      act(() => result.current.unlock(mockCorrectPassword));
      rerender();

      expect(result.current.isLocked).toEqual(false);
      expect(mockShelter.unlockApp$).toBeCalledWith(mockCorrectPassword);
    });

    it('should show error toast if an incorrect password is given', () => {
      mockShelter.unlockApp$.mockImplementationOnce(() => new BehaviorSubject<boolean>(false));
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.unlock('mockIncorrectPassword'));

      expect(result.current.isLocked).toEqual(true);
      expect(mockShelter.unlockApp$).toBeCalledWith('mockIncorrectPassword');
      expect(mockReactNativeToastMessage.show).toBeCalled();
    });
  });

  describe('biometry authentication', () => {
    it('should unlock if biometry authentication passes', async () => {
      mockShelter.getBiometryPassword.mockImplementationOnce(() =>
        mockKeychain.getGenericPassword(biometryKeychainOptions)
      );
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(mockShelter.getBiometryPassword).toBeCalled();
      expect(result.current.isLocked).toEqual(false);
    });

    it('should do nothing if biometry authentication fails', async () => {
      mockShelter.getBiometryPassword.mockRejectedValueOnce(new Error('Mock error'));
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(result.current.isLocked).toEqual(true);
      expect(mockShelter.getBiometryPassword).toBeCalled();
      expect(mockReactNativeToastMessage.show).not.toBeCalled();
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
      expect(result.current.isLocked).toEqual(true);
    });
  });
});
