import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { PromotionItem } from 'src/components/promotion-item';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { useInternalAdsAnalyticsWithImpressionCallback } from 'src/hooks/use-internal-ads-analytics.hook';
import { useOutsideOfListIntersection } from 'src/hooks/use-outside-of-list-intersection.hook';
import { SaplingTransactionHistoryItem } from 'src/interfaces/sapling-service.interface';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsSaplingHistoryLoadingSelector, useSaplingTransactionHistorySelector } from 'src/store/sapling';

import { PrivateActivityItem } from './private-activity-item';
import { usePrivateTezosTokenHistoryStyles } from './private-tezos-token-history.styles';

const keyExtractor = (item: SaplingTransactionHistoryItem) => `${item.type}-${item.position}`;

const PROMOTION_ID = 'private-activities-promotion';
const PAGE_NAME = 'PrivateTezosTokenHistory';

export const PrivateTezosTokenHistory = () => {
  const transactions = useSaplingTransactionHistorySelector();
  const isLoading = useIsSaplingHistoryLoadingSelector();
  const styles = usePrivateTezosTokenHistoryStyles();

  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(PROMOTION_ID, PromotionProviderEnum.HypeLab);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const shouldShowPromotion = partnersPromotionEnabled && !promotionErrorOccurred && !isHiddenTemporarily;

  const adRef = useRef<View>(null);
  const { onAdLoad, onIsVisible, onAdImpression } = useInternalAdsAnalyticsWithImpressionCallback(PAGE_NAME);
  const { onElementOrParentLayout } = useOutsideOfListIntersection(undefined, adRef, onIsVisible);

  const handlePromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

  const renderItem: ListRenderItem<SaplingTransactionHistoryItem> = useCallback(
    ({ item }) => <PrivateActivityItem transaction={item} />,
    []
  );

  const ListHeaderComponent = useMemo(
    () =>
      shouldShowPromotion ? (
        <PromotionItem
          ref={adRef}
          id={PROMOTION_ID}
          pageName={PAGE_NAME}
          testID="PrivateTezosTokenHistory/promotion"
          style={styles.promotionItemWrapper}
          onLayout={onElementOrParentLayout}
          onError={handlePromotionError}
          onLoad={onAdLoad}
          onImpression={onAdImpression}
        />
      ) : undefined,
    [shouldShowPromotion, styles, onElementOrParentLayout, handlePromotionError, onAdLoad, onAdImpression]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyListWrapper}>
        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <DataPlaceholder text="No private transactions yet." />
        )}
      </View>
    ),
    [isLoading, styles]
  );

  return (
    <View style={styles.contentContainer}>
      <FlashList
        data={transactions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};
