import { renderHookAsync, renderHook } from '@testing-library/react-native';

import { mockReactNativeQuickActions } from 'src/mocks/react-native-quick-actions.mock';
import { mockDeviceEventEmitter, mockDeviceEventEmitterInstance } from 'src/mocks/react-native.mock';

import { useQuickActions } from './use-quick-actions';

describe('useQuickActions', () => {
  it('should set shortcut items and add quick action shortcut listener on start', async () => {
    await renderHookAsync(() => useQuickActions());

    expect(mockReactNativeQuickActions.setShortcutItems).toHaveBeenCalledWith([
      {
        type: 'Hide balance',
        title: 'Hide balance',
        icon: 'Prohibit',
        userInfo: { url: '' }
      }
    ]);
    expect(mockDeviceEventEmitter.addListener).toHaveBeenCalled();

    expect(mockReactNativeQuickActions.clearShortcutItems).not.toHaveBeenCalled();
    expect(mockDeviceEventEmitterInstance.remove).not.toHaveBeenCalled();
  });

  it('should clear shortcut items and remove quick action shortcut listener on unmount', async () => {
    const { unmount } = renderHook(() => useQuickActions());

    unmount();

    expect(mockReactNativeQuickActions.clearShortcutItems).toHaveBeenCalled();
    expect(mockDeviceEventEmitterInstance.remove).toHaveBeenCalled();
  });
});
