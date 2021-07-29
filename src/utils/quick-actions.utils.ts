import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import QuickActions, { ShortcutItem } from 'react-native-quick-actions';

import { useHideBalance } from './hide-balance/hide-balance.hook';
import { isDefined } from './is-defined';

interface QuickActionParams {
  data: ShortcutItem;
}

export const useQuickActions = () => {
  const { toggleHideBalance, isBalanceHidden } = useHideBalance();

  const quickActionHandler = ({ data }: QuickActionParams) =>
    // TODO: find a solution to handle quick actions on cold start
    !isDefined(data) && !isBalanceHidden && toggleHideBalance();

  useEffect(() => {
    QuickActions.setShortcutItems([
      {
        type: 'Hide balance',
        title: 'Hide balance',
        icon: 'Prohibit',
        userInfo: {
          url: ''
        }
      }
    ]);
    DeviceEventEmitter.addListener('quickActionShortcut', quickActionHandler);

    return () => {
      QuickActions.clearShortcutItems();
      DeviceEventEmitter.removeListener('quickActionShortcut', quickActionHandler);
    };
  }, []);
};
