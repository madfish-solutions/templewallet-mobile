import QuickActions, { ShortcutItem } from 'react-native-quick-actions';

import { EmptyFn } from '../config/general';

export const initQuickActions = () =>
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

export interface QuickActionParams {
  data: ShortcutItem;
  isBalanceHiddenSetting: boolean;
  hideBalanceHandler: EmptyFn;
}

export const quickActionHandler = ({ data, isBalanceHiddenSetting, hideBalanceHandler }: QuickActionParams) => {
  // TODO: find a solution to handle quick actions on cold start
  if (data && !isBalanceHiddenSetting) {
    hideBalanceHandler();
  }
};
