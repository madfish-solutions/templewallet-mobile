import { NotificationPlatformType } from '../enums/notification-platform-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationInterface {
  id: number;
  status: NotificationStatus;
  createdAt: string;
  type: NotificationType;
  platforms: NotificationPlatformType[];
  language: string;
  title: string;
  description: string;
  content: string;
  extensionImageUrl: string;
  mobileImageUrl: string;
  sourceUrl?: string;
  link?: {
    url: string;
    beforeLinkText: string;
    linkText: string;
    afterLinkText: string;
  };
}
