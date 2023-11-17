import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { useIsPartnersPromoShown, usePartnersPromoLoad } from 'src/hooks/use-partners-promo';
import { NotificationInterface } from 'src/interfaces/notification.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { viewAllNotificationsAction } from 'src/store/notifications/notifications-actions';
import { useNotificationsSelector } from 'src/store/notifications/notifications-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { NotificationPreviewItem } from './notification-preview-item/notification-preview-item';
import { NotificationsSelectors } from './notifications.selectors';
import { NotificationsStyles } from './notifications.styles';

const VIEW_ALL_NOTIFICATIONS_TIMEOUT = 5 * 1000;
const AVERAGE_NOTIFICATION_ITEM_HEIGHT = Math.round(formatSize(132));

const keyExtractor = (item: NotificationInterface) => item.id.toString();

const renderItem: ListRenderItem<NotificationInterface> = ({ item }) => <NotificationPreviewItem notification={item} />;

const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;

export const Notifications = () => {
  const notifications = useNotificationsSelector();
  const dispatch = useDispatch();
  const partnersPromoShown = useIsPartnersPromoShown();
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);

  usePartnersPromoLoad();

  const handlePromotionItemError = useCallback(() => setPromotionErrorOccurred(true), []);

  useEffect(() => {
    const timer = setTimeout(() => void dispatch(viewAllNotificationsAction()), VIEW_ALL_NOTIFICATIONS_TIMEOUT);

    return () => clearTimeout(timer);
  }, [dispatch, notifications]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <>
      {partnersPromoShown && !promotionErrorOccurred && (
        <>
          <OptimalPromotionItem
            testID={NotificationsSelectors.promotion}
            style={NotificationsStyles.ads}
            onImageError={handlePromotionItemError}
            onEmptyPromotionReceived={handlePromotionItemError}
          />
          <HorizontalBorder />
        </>
      )}
      <FlashList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={AVERAGE_NOTIFICATION_ITEM_HEIGHT}
        contentContainerStyle={NotificationsStyles.contentContainer}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
