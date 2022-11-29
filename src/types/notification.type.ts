import { HardcodedNotification } from '../interfaces/hardcoded-notification.interface';
import { NotificationInterface } from '../interfaces/notification.interface';

export type Notification = NotificationInterface | HardcodedNotification;
