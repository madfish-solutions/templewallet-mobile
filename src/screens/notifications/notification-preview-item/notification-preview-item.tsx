import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { NotificationStatus } from '../../../enums/notification-status.enum';
import { NotificationType } from '../../../enums/notification-type.enum';
import { NotificationInterface } from '../../../interfaces/notification.interface';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { formatDate } from '../../../utils/format-date.utils';
import { AlertIcon } from '../icons/alert.icon';
import { NewsIcon } from '../icons/news.icon';
import { UpdateIcon } from '../icons/update.icon';
import { useNotificationPreviewItemStyles } from './notification-preview-item.styles';

interface Props {
  notification: NotificationInterface;
}

export const NotificationPreviewItem: FC<Props> = ({ notification }) => {
  const styles = useNotificationPreviewItemStyles();
  const colors = useColors();
  const { navigate } = useNavigation();

  const isNew = status === NotificationStatus.New;

  const handlePress = () => navigate(ScreensEnum.NotificationsItem, { id: notification.id });

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={status === NotificationStatus.Read ? styles.containerRead : styles.container}
    >
      {notification.type === NotificationType.SecurityNote ? (
        <AlertIcon color={colors.gray2} isNotification={isNew} />
      ) : notification.type === NotificationType.PlatformUpdate ? (
        <UpdateIcon color={colors.gray2} isNotification={isNew} />
      ) : (
        <NewsIcon color={colors.gray2} isNotification={isNew} />
      )}
      <Divider size={formatSize(10)} />
      <View style={styles.contentWrapper}>
        <View>
          <Text style={status === NotificationStatus.Read ? styles.titleRead : styles.title}>{notification.title}</Text>
          <Divider size={formatSize(8)} />
          <Text style={styles.description}>{notification.description}</Text>
        </View>
        <View style={styles.dateDetailsInfo}>
          <Text style={styles.createdAt}>{formatDate(notification.createdAt)}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>Details</Text>
            <Divider size={formatSize(4)} />
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(16)} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
