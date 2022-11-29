import React, { useEffect } from 'react';
import { FlatList, ListRenderItem, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { HardcodedNotificationType } from '../../enums/hardcoded-notification-type.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { viewAllNotificationsAction } from '../../store/notifications/notifications-actions';
import { useNotificationsSelector } from '../../store/notifications/notifications-selectors';
import { Notification } from '../../types/notification.type';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NotificationPreviewItem } from './notification-preview-item/notification-preview-item';
import { useNotificationsStyles } from './notifications.styles';

const VIEW_ALL_NOTIFICATIONS_TIMEOUT = 5 * 1000;

const keyExtractor = (item: Notification) => item.id.toString();
const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;
const renderItem: ListRenderItem<Notification> = ({ item }) => {
  if (item.type === HardcodedNotificationType.Welcome) {
    return null;
  }

  return <NotificationPreviewItem key={item.id} notification={item} />;
};

export const Notifications = () => {
  const styles = useNotificationsStyles();
  const notifications = useNotificationsSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => void dispatch(viewAllNotificationsAction()), VIEW_ALL_NOTIFICATIONS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [notifications]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <ScrollView style={styles.contentWrapper}>
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </ScrollView>
  );
};
