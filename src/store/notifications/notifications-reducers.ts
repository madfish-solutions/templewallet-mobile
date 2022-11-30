import { createReducer } from '@reduxjs/toolkit';

import { NotificationStatus } from '../../enums/notification-status.enum';
import { createEntity } from '../create-entity';
import {
  loadNotificationsAction,
  setIsNewsEnabledAction,
  readNotificationsItemAction,
  viewAllNotificationsAction
} from './notifications-actions';
import { notificationsInitialState, NotificationsState } from './notifications-state';

export const notificationsReducers = createReducer<NotificationsState>(notificationsInitialState, builder => {
  builder.addCase(loadNotificationsAction.submit, state => ({
    ...state,
    list: createEntity(state.list.data, true)
  }));
  builder.addCase(loadNotificationsAction.success, (state, { payload }) => {
    const notifications = state.list.data;
    const lastNotificationId = notifications[0].id;

    const newNotifications = payload.filter(notification => notification.id > lastNotificationId).reverse();

    return {
      ...state,
      list: createEntity([...newNotifications, ...notifications], false)
    };
  });
  builder.addCase(loadNotificationsAction.fail, state => ({
    ...state,
    list: createEntity(state.list.data, false)
  }));

  builder.addCase(viewAllNotificationsAction, state => ({
    ...state,
    list: createEntity(
      state.list.data.map(notification => {
        if (notification.status === NotificationStatus.New) {
          return {
            ...notification,
            status: NotificationStatus.Viewed
          };
        }

        return notification;
      })
    )
  }));
  builder.addCase(readNotificationsItemAction, (state, { payload: notificationId }) => ({
    ...state,
    list: createEntity(
      state.list.data.map(notification => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            status: NotificationStatus.Read
          };
        }

        return notification;
      })
    )
  }));

  builder.addCase(setIsNewsEnabledAction, (state, { payload: isNewsEnabled }) => ({
    ...state,
    isNewsEnabled
  }));
});
