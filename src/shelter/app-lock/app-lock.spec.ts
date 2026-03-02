import { renderHook, act } from '@testing-library/react-hooks';

import { mockCorrectPassword, mockCorrectUserCredentialsValue } from 'src/mocks/react-native-keychain.mock';
import { mockReactNativeToastMessage } from 'src/mocks/react-native-toast-message.mock';

import { mockShelter } from '../shelter.mock';

import { useAppLock } from './app-lock';

// TODO: figure out how to test ContextProvider value
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('useAppLock', () => {
  beforeEach(() => {
    mockShelter.unlockApp$.mockClear();
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
    jest.useFakeTimers();
    afterAll(() => void jest.useRealTimers());

    it('should unlock if a correct password is given', async () => {
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.unlock(mockCorrectPassword));
      await jest.runAllTimersAsync();

      expect(result.current.isLocked).toEqual(false);
      expect(mockShelter.unlockApp$).toHaveBeenCalledWith(mockCorrectPassword);
    });

    it('should show error toast if an incorrect password is given', async () => {
      const mockIncorrectPassword = 'mockIncorrectPassword';
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.unlock(mockIncorrectPassword));
      await jest.runAllTimersAsync();

      expect(result.current.isLocked).toEqual(true);
      expect(mockShelter.unlockApp$).toHaveBeenCalledWith(mockIncorrectPassword);
      expect(mockReactNativeToastMessage.show).toHaveBeenCalled();
    });
  });

  describe('biometry authentication', () => {
    jest.useFakeTimers();
    afterAll(() => void jest.useRealTimers());

    it('should unlock if biometry authentication passes', async () => {
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());
      await jest.runAllTimersAsync();

      expect(mockShelter.getBiometryPassword).toHaveBeenCalled();
      expect(mockShelter.unlockApp$).toHaveBeenCalledWith(mockCorrectUserCredentialsValue);
    });

    it('should do nothing if biometry authentication fails', async () => {
      mockShelter.getBiometryPassword.mockRejectedValueOnce(new Error('Mock error'));
      const { result } = renderHook(() => useAppLock());

      await act(() => result.current.unlockWithBiometry());
      await jest.runAllTimersAsync();

      expect(mockShelter.getBiometryPassword).toHaveBeenCalled();
      expect(mockShelter.unlockApp$).not.toHaveBeenCalled();
    });
  });

  describe('lock', () => {
    beforeEach(() => {
      mockShelter.lockApp.mockReset();
    });

    it('should be able to lock', async () => {
      const { result } = renderHook(() => useAppLock());

      act(() => result.current.lock());

      expect(mockShelter.lockApp).toHaveBeenCalled();
      expect(result.current.isLocked).toEqual(true);
    });
  });
});
