import React, { useCallback, useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from '../../components/screen-container/screen-container.styles';
import { HardcodedNotificationType } from '../../enums/hardcoded-notification-type.enum';
import { NotificationType } from '../../enums/notification-type.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { viewAllNotificationsAction } from '../../store/notifications/notifications-actions';
import {
  useNotificationsSelector,
  useNotificationsStartFromTimeSelector
} from '../../store/notifications/notifications-selectors';
import { Notification } from '../../types/notification.type';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NotificationPreviewItem } from './notification-preview-item/notification-preview-item';
import { NotificationsStyles } from './notifications.styles';

const VIEW_ALL_NOTIFICATIONS_TIMEOUT = 5 * 1000;

const keyExtractor = (item: Notification) => item.id.toString();

const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;

export const Notifications = () => {
  const styles = useScreenContainerStyles();
  const notifications = useNotificationsSelector();
  const startFromTime = useNotificationsStartFromTimeSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => void dispatch(viewAllNotificationsAction()), VIEW_ALL_NOTIFICATIONS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [notifications]);

  usePageAnalytic(ScreensEnum.Notifications);

  const renderItem: ListRenderItem<Notification> = useCallback(
    ({ item }) => {
      if (item.type === HardcodedNotificationType.Welcome) {
        const notification = {
          id: item.id,
          status: item.status,
          type: NotificationType.News,
          title: 'Welcome to the Temple wallet!',
          description: 'Thank you for choosing Temple wallet for all your Tezos related needs!',
          createdAt: new Date(startFromTime).toString()
        };

        return <NotificationPreviewItem key={item.id} notification={notification} />;
      }

      return <NotificationPreviewItem key={item.id} notification={item} />;
    },
    [startFromTime]
  );

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
