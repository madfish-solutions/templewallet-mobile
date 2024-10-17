import { createAction } from '@reduxjs/toolkit';

import { NotificationInterface } from 'src/interfaces/notification.interface';

import { createActions } from '../create-actions';

export const loadNotificationsAction = createActions<void, NotificationInterface[]>('notifications/LOAD_NOTIFICATIONS');

export const viewAllNotificationsAction = createAction<void>('notifications/VIEW_ALL_NOTIFICATIONS');
export const readNotificationsItemAction = createAction<number>('notifications/READ_NOTIFICATIONS_ITEM');

export const setIsNewsEnabledAction = createAction<boolean>('notifications/SET_IS_NEWS_ENABLED');

export const setShouldRedirectToNotificationsAction = createAction<boolean>(
  'notifications/SET_SHOULD_REDIRECT_TO_NOTIFICATIONS'
);
