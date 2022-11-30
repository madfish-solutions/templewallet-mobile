import { HARDCODED_NOTIFICATIONS } from '../../interfaces/hardcoded-notification.interface';
import { Notification } from '../../types/notification.type';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface NotificationsState {
  startFromTime: number;
  list: LoadableEntityState<Notification[]>;
  isNewsEnabled: boolean;
}

export const notificationsInitialState: NotificationsState = {
  startFromTime: new Date().getTime(),
  list: createEntity(HARDCODED_NOTIFICATIONS),
  isNewsEnabled: true
};

export interface NotificationsRootState {
  notifications: NotificationsState;
}
