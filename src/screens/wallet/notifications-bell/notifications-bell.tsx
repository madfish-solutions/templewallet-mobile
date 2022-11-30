import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useIsNewNotificationsAvailableSelector } from '../../../store/notifications/notifications-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { NotificationsBellStyles } from './notifications-bell.styles';

export const NotificationsBell = () => {
  const colors = useColors();
  const { navigate } = useNavigation();

  const isNewNotificationsAvailable = useIsNewNotificationsAvailableSelector();

  return (
    <TouchableOpacity style={NotificationsBellStyles.iconContainer} onPress={() => navigate(ScreensEnum.Notifications)}>
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
};
