import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { NotificationStatus } from 'src/enums/notification-status.enum';
import { NotificationType } from 'src/enums/notification-type.enum';
import { NotificationInterface } from 'src/interfaces/notification.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatDateOutput } from 'src/utils/date.utils';

import { NotificationsSelectors } from '../notifications.selectors';

import { useNotificationPreviewItemStyles } from './notification-preview-item.styles';

const NotificationsIconMap: Record<NotificationType, IconNameEnum> = {
  [NotificationType.News]: IconNameEnum.News,
  [NotificationType.PlatformUpdate]: IconNameEnum.Update,
  [NotificationType.SecurityNote]: IconNameEnum.AlertTriangle
};

interface Props {
  notification: NotificationInterface;
}

export const NotificationPreviewItem: FC<Props> = ({ notification }) => {
  const styles = useNotificationPreviewItemStyles();
  const colors = useColors();
  const navigateToScreen = useNavigateToScreen();

  const handlePress = () =>
    navigateToScreen({ screen: ScreensEnum.NotificationsItem, params: { id: notification.id } });

  return (
    <SafeTouchableOpacity
      style={[
        styles.container,
        conditionalStyle(notification.status === NotificationStatus.Read, styles.containerRead)
      ]}
      onPress={handlePress}
      testID={NotificationsSelectors.notificationPreviewButton}
    >
      <View style={styles.iconContainer}>
        {notification.status === NotificationStatus.New && (
          <Icon
            name={IconNameEnum.NotificationDot}
            width={formatSize(9)}
            height={formatSize(9)}
            color={colors.navigation}
            style={styles.notificationDotIcon}
          />
        )}
        <Icon name={NotificationsIconMap[notification.type]} size={formatSize(24)} color={colors.gray2} />
      </View>
      <Divider size={formatSize(10)} />
      <View style={styles.contentWrapper}>
        <View>
          <Text style={notification.status === NotificationStatus.Read ? styles.titleRead : styles.title}>
            {notification.title}
          </Text>
          <Divider size={formatSize(8)} />
          <Text style={styles.description}>{notification.description}</Text>
        </View>
        <View style={styles.dateDetailsInfo}>
          <Text style={styles.createdAt}>{formatDateOutput(notification.createdAt)}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>Details</Text>
            <Divider size={formatSize(4)} />
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(16)} />
          </View>
        </View>
      </View>
    </SafeTouchableOpacity>
  );
};
