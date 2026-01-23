import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useIsNewNotificationsAvailableSelector } from 'src/store/notifications/notifications-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { WalletSelectors } from '../wallet.selectors';

import { NotificationsBellStyles } from './notifications-bell.styles';

export const NotificationsBell = memo(() => {
  const colors = useColors();
  const navigateToScreen = useNavigateToScreen();

  const isNewNotificationsAvailable = useIsNewNotificationsAvailableSelector();

  return (
    <TouchableOpacity
      style={NotificationsBellStyles.iconContainer}
      onPress={() => navigateToScreen({ screen: ScreensEnum.Notifications })}
      testID={WalletSelectors.notificationsButton}
    >
      {isNewNotificationsAvailable && (
        <Icon
          name={IconNameEnum.NotificationDot}
          width={formatSize(9)}
          height={formatSize(9)}
          color={colors.navigation}
          style={NotificationsBellStyles.notificationDotIcon}
        />
      )}
      <Icon name={IconNameEnum.Bell} size={formatSize(24)} />
    </TouchableOpacity>
  );
});
