import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { NotificationInterface } from 'src/interfaces/notification.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { viewAllNotificationsAction } from 'src/store/notifications/notifications-actions';
import { useNotificationsSelector } from 'src/store/notifications/notifications-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { NotificationPreviewItem } from './notification-preview-item/notification-preview-item';
import { NotificationsStyles } from './notifications.styles';

const VIEW_ALL_NOTIFICATIONS_TIMEOUT = 5 * 1000;
const AVERAGE_NOTIFICATION_ITEM_HEIGHT = 127;

const keyExtractor = (item: NotificationInterface) => item.id.toString();

const renderItem: ListRenderItem<NotificationInterface> = ({ item }) => <NotificationPreviewItem notification={item} />;

const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;

export const Notifications = () => {
  const notifications = useNotificationsSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => void dispatch(viewAllNotificationsAction()), VIEW_ALL_NOTIFICATIONS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [notifications]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <FlashList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={AVERAGE_NOTIFICATION_ITEM_HEIGHT}
      contentContainerStyle={NotificationsStyles.contentContainer}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
