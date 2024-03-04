import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { PromotionItem } from 'src/components/promotion-item';
import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
import { useOutsideOfListIntersection } from 'src/hooks/use-outside-of-list-intersection.hook';
import { useIsPartnersPromoShown } from 'src/hooks/use-partners-promo';
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
const PROMOTION_ID = 'notifications-promotion';

const keyExtractor = (item: NotificationInterface) => item.id.toString();

const renderItem: ListRenderItem<NotificationInterface> = ({ item }) => <NotificationPreviewItem notification={item} />;

const ListEmptyComponent = <DataPlaceholder text="Notifications not found" />;

export const Notifications = () => {
  const notifications = useNotificationsSelector();
  const dispatch = useDispatch();
  const partnersPromoShown = useIsPartnersPromoShown(PROMOTION_ID);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);

  const adRef = useRef<View>(null);
  const { onAdLoad, onIsVisible } = useInternalAdsAnalytics('Notifications');
  const { onElementOrParentLayout } = useOutsideOfListIntersection(undefined, adRef, onIsVisible);

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
          <PromotionItem
            id={PROMOTION_ID}
            testID={NotificationsSelectors.promotion}
            style={NotificationsStyles.ads}
            ref={adRef}
            onError={handlePromotionItemError}
            onLayout={onElementOrParentLayout}
            onLoad={onAdLoad}
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
