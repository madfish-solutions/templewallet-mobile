import { NotificationType } from 'src/enums/notification-type.enum';

const BUCKET_URL = 'https://generic-objects.fra1.digitaloceanspaces.com/notification-icons/mobile';

export const NotificationImageFallbacks: Record<NotificationType, string> = {
  [NotificationType.News]: `${BUCKET_URL}/news.svg`,
  [NotificationType.PlatformUpdate]: `${BUCKET_URL}/platform-update.svg`,
  [NotificationType.SecurityNote]: `${BUCKET_URL}//security-note.svg`
};
