import React, { useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from '../../components/screen-container/screen-container.styles';
import { NotificationInterface } from '../../interfaces/notification.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { viewAllNotificationsAction } from '../../store/notifications/notifications-actions';
import { useNotificationsSelector } from '../../store/notifications/notifications-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NotificationPreviewItem } from './notification-preview-item/notification-preview-item';
import { NotificationsStyles } from './notifications.styles';

const VIEW_ALL_NOTIFICATIONS_TIMEOUT = 5 * 1000;

const keyExtractor = (item: NotificationInterface) => item.id.toString();

const renderItem: ListRenderItem<NotificationInterface> = ({ item }) => (
  <NotificationPreviewItem key={item.id} notification={item} />
);

const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;

export const Notifications = () => {
  const styles = useScreenContainerStyles();
  const notifications = useNotificationsSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => void dispatch(viewAllNotificationsAction()), VIEW_ALL_NOTIFICATIONS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [notifications]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollViewContentContainer, NotificationsStyles.scrollViewContentContainer]}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
