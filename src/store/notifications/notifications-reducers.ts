import { createReducer } from '@reduxjs/toolkit';

import { NotificationStatus } from 'src/enums/notification-status.enum';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import {
  loadNotificationsAction,
  setIsNewsEnabledAction,
  readNotificationsItemAction,
  viewAllNotificationsAction,
  setShouldRedirectToNotificationsAction
} from './notifications-actions';
import { notificationsInitialState, NotificationsState } from './notifications-state';

export const notificationsReducers = createReducer<NotificationsState>(notificationsInitialState, builder => {
  builder.addCase(loadNotificationsAction.submit, state => ({
    ...state,
    list: createEntity(state.list.data, true)
  }));
  builder.addCase(loadNotificationsAction.success, (state, { payload: notifications }) => {
    const notificationsWithStatus = notifications.map(notification => {
      const prevNotification = state.list.data.find(item => item.id === notification.id);

      if (isDefined(prevNotification)) {
        return {
          ...notification,
          status: prevNotification.status
        };
      }

      return notification;
    });

    return {
      ...state,
      list: createEntity(notificationsWithStatus, false)
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

  builder.addCase(setShouldRedirectToNotificationsAction, (state, { payload: shouldRedirectToNotifications }) => {
    state.shouldRedirectToNotifications = shouldRedirectToNotifications;
  });
});
