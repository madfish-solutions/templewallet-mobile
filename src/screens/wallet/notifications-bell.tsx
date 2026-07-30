import React, { memo, useCallback } from 'react';

import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useIsNewNotificationsAvailableSelector } from 'src/store/notifications/notifications-selectors';

import { ActionButton } from './action-button';
import { WalletSelectors } from './wallet.selectors';

export const NotificationsBell = memo(() => {
  const navigateToScreen = useNavigateToScreen();

  const isNewNotificationsAvailable = useIsNewNotificationsAvailableSelector();
  const onPress = useCallback(() => navigateToScreen({ screen: ScreensEnum.Notifications }), [navigateToScreen]);

  return (
    <ActionButton
      iconName={IconNameV2Enum.Notification}
      isDotVisible={isNewNotificationsAvailable}
      testID={WalletSelectors.notificationsButton}
      onPress={onPress}
    />
  );
});
