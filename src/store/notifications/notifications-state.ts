import { NotificationInterface } from '../../interfaces/notification.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface NotificationsState {
  startFromTime: number;
  list: LoadableEntityState<NotificationInterface[]>;
  isNewsEnabled: boolean;
}

export const notificationsInitialState: NotificationsState = {
  startFromTime: new Date().getTime(),
  list: createEntity([]),
  isNewsEnabled: true
};
