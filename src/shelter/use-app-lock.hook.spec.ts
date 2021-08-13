import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { BehaviorSubject } from 'rxjs';

import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { mockReactNativeToastMessage } from '../mocks/react-native-toast-message.mock';
import { mockShelter } from './shelter.mock';
import { useAppLock } from './use-app-lock.hook';

describe('useAppLock', () => {
  beforeEach(() => {
    mockShelter._isLocked$.next(true);
  });

  describe('initial state', () => {
    it('should be locked on start by default', () => {
      const { result } = renderHook(() => useAppLock());

      expect(result.current.isLocked).toEqual(true);
    });

    it('should be unlocked if shelter is unlocked on start', () => {
      const { result } = renderHook(() => useAppLock());

      act(() => mockShelter._isLocked$.next(false));

      expect(result.current.isLocked).toEqual(false);
    });
  });

  describe('password authentication', () => {
    beforeEach(() => {
      mockReactNativeToastMessage.show.mockReset();
    });

    it('should unlock if a correct password is given', () => {
      const { result } = renderHook(() => useAppLock());

      act(() => {
        result.current.unlock(mockCorrectPassword);
      });

      expect(result.current.isLocked).toEqual(false);
    });

    it('should show error toast if an incorrect password is given', () => {
      mockShelter.unlockApp$.mockImplementationOnce(() => new BehaviorSubject<boolean>(false));
      const { result } = renderHook(() => useAppLock());

      act(() => {
        result.current.unlock('mockIncorrectPassword');
      });

      expect(result.current.isLocked).toEqual(true);
      expect(mockReactNativeToastMessage.show).toBeCalled();
    });
  });

  describe('biometry authentication', () => {
    beforeEach(() => {
      mockReactNativeToastMessage.show.mockReset();
    });

    it('should unlock if biometry authentication passes', async () => {
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(result.current.isLocked).toEqual(false);
    });

    it('should do nothing if biometry authentication fails', async () => {
      mockShelter.getBiometryPassword.mockRejectedValueOnce(new Error('Mock error'));
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());

      expect(result.current.isLocked).toEqual(true);
      expect(mockReactNativeToastMessage.show).not.toBeCalled();
    });
  });

  describe('lock', () => {
    it('should be able to lock', async () => {
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.lock());

      expect(result.current.isLocked).toEqual(true);
    });
  });
});
