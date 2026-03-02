import { useMemo } from 'react';

import { NotificationStatus } from 'src/enums/notification-status.enum';
import { NotificationType } from 'src/enums/notification-type.enum';
import { useSelector } from 'src/store/selector';

import { NotificationsState } from './notifications-state';

const getFilteredNotifications = (notificationsState: NotificationsState) => {
  const notifications = notificationsState.list.data;

  if (!notificationsState.isNewsEnabled) {
    return notifications.filter(notification => notification.type !== NotificationType.News);
  }

  return notifications;
};

export const useNotifications = () => {
  const notificationsState = useSelector(state => state.notifications);

  return useMemo(() => getFilteredNotifications(notificationsState), [notificationsState]);
};

export const useNotificationsItemSelector = (id: number) =>
  useSelector(state => state.notifications.list.data.find(notification => notification.id === id));

export const useIsNewNotificationsAvailableSelector = () =>
  useSelector(state =>
    getFilteredNotifications(state.notifications).some(notification => notification.status === NotificationStatus.New)
  );

export const useIsNewsEnabledSelector = () => useSelector(({ notifications }) => notifications.isNewsEnabled);

export const useShouldRedirectToNotificationsSelector = () =>
  useSelector(({ notifications }) => notifications.shouldRedirectToNotifications);
