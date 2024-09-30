import { NotificationStatus } from 'src/enums/notification-status.enum';
import { NotificationType } from 'src/enums/notification-type.enum';
import { useSelector } from 'src/store/selector';
import type { RootState } from 'src/store/types';

const getFilteredNotifications = (state: RootState) => {
  const notifications = state.notifications.list.data;

  if (!state.notifications.isNewsEnabled) {
    return notifications.filter(notification => notification.type !== NotificationType.News);
  }

  return notifications;
};

export const useNotificationsSelector = () => useSelector(state => getFilteredNotifications(state));

export const useNotificationsItemSelector = (id: number) =>
  useSelector(state => state.notifications.list.data.find(notification => notification.id === id));

export const useIsNewNotificationsAvailableSelector = () =>
  useSelector(state =>
    getFilteredNotifications(state).some(notification => notification.status === NotificationStatus.New)
  );

export const useIsNewsEnabledSelector = () => useSelector(({ notifications }) => notifications.isNewsEnabled);

export const useShouldRedirectToNotificationsSelector = () =>
  useSelector(({ notifications }) => notifications.shouldRedirectToNotifications);
