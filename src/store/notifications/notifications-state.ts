import { WELCOME_NOTIFICATION } from '../../interfaces/hardcoded-notification.interface';
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
  list: createEntity([WELCOME_NOTIFICATION]),
  isNewsEnabled: true
};

export interface NotificationsRootState {
  notifications: NotificationsState;
}
