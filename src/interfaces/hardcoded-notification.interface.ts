import { HardcodedNotificationType } from '../enums/hardcoded-notification-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationInterface } from './notification.interface';

export interface HardcodedNotification extends Pick<NotificationInterface, 'id' | 'status'> {
  type: HardcodedNotificationType;
}

export const HARDCODED_NOTIFICATIONS: HardcodedNotification[] = [
  {
    id: -1,
    status: NotificationStatus.New,
    type: HardcodedNotificationType.Welcome
  }
];
