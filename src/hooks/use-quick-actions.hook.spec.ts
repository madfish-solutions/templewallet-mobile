import { renderHook } from '@testing-library/react-hooks';

import { mockReactNativeQuickActions } from '../mocks/react-native-quick-actions.mock';
import { mockDeviceEventEmitter } from '../mocks/react-native.mock';
import { useQuickActions } from './use-quick-actions.hook';

describe('useQuickActions', () => {
  it('should set shortcut items and add quick action shortcut listener on start', () => {
    renderHook(() => useQuickActions());

    expect(mockReactNativeQuickActions.setShortcutItems).toBeCalledWith([
      {
        type: 'Hide balance',
        title: 'Hide balance',
        icon: 'Prohibit',
        userInfo: { url: '' }
      }
    ]);
    expect(mockDeviceEventEmitter.addListener).toBeCalled();

    expect(mockReactNativeQuickActions.clearShortcutItems).not.toBeCalled();
    expect(mockDeviceEventEmitter.removeListener).not.toBeCalled();
  });

  it('should clear shortcut items and remove quick action shortcut listener on unmount', () => {
    const { unmount } = renderHook(() => useQuickActions());

    unmount();

    expect(mockReactNativeQuickActions.clearShortcutItems).toBeCalled();
    expect(mockDeviceEventEmitter.removeListener).toBeCalled();
  });
});
