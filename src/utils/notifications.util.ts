import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { templeWalletApi } from '../api.service';
import { NotificationPlatformType } from '../enums/notification-platform-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationInterface } from '../interfaces/notification.interface';

interface RequestParams {
  platform: NotificationPlatformType;
  startFromTime: number;
}

export const loadNotifications$ = (startFromTime: number) =>
  from(
    templeWalletApi.get<RequestParams, NotificationInterface[]>('/notifications', {
      params: {
        platfrom: NotificationPlatformType.Mobile,
        startFromTime
      }
    })
  ).pipe(map(response => response.map(notification => ({ ...notification, status: NotificationStatus.New }))));
