import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import QuickActions, { ShortcutItem } from 'react-native-quick-actions';

import { useBalanceHiddenSelector } from '../store/settings/settings-selectors';
import { useHideBalance } from './hide-balance/hide-balance.hook';
import { isDefined } from './is-defined';

export interface QuickActionParams {
  data: ShortcutItem;
}

export const useQuickActions = () => {
  const isBalanceHiddenSetting = useBalanceHiddenSelector();
  const { hideBalanceHandler } = useHideBalance();

  const quickActionHandler = ({ data }: QuickActionParams) =>
    // TODO: find a solution to handle quick actions on cold start
    !isDefined(data) && !isBalanceHiddenSetting && hideBalanceHandler();

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
