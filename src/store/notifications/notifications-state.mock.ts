import { WELCOME_NOTIFICATION } from '../../interfaces/hardcoded-notification.interface';
import { createEntity } from '../create-entity';
import { NotificationsState } from './notifications-state';

export const mockNotificationsState: NotificationsState = {
  startFromTime: new Date('2022-11-29T13:00:00.000Z').getTime(),
  list: createEntity([WELCOME_NOTIFICATION]),
  isNewsEnabled: true
};
