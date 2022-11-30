import { HARDCODED_NOTIFICATIONS } from '../../interfaces/hardcoded-notification.interface';
import { createEntity } from '../create-entity';
import { NotificationsState } from './notifications-state';

export const mockNotificationsState: NotificationsState = {
  startFromTime: new Date('2022-11-29T13:00:00.000Z').getTime(),
  list: createEntity(HARDCODED_NOTIFICATIONS),
  isNewsEnabled: true
};
