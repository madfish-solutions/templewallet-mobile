import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { templeWalletApi } from '../api.service';
import { NotificationPlatformType } from '../enums/notification-platform-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationInterface } from '../interfaces/notification.interface';

export const loadNotifications$ = (startFromTime: number) =>
  from(
    templeWalletApi.get<NotificationInterface[]>('/notifications', {
      params: {
        platform: NotificationPlatformType.Mobile,
        startFromTime
      }
    })
  ).pipe(map(response => response.data.map(notification => ({ ...notification, status: NotificationStatus.New }))));
