import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';

import { Activity } from 'src/activity/types';
import { toActivityKey } from 'src/activity/utils';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { PromotionItem } from 'src/components/promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { useInternalAdsAnalyticsWithImpressionCallback } from 'src/hooks/use-internal-ads-analytics.hook';
import { useOutsideOfListIntersection } from 'src/hooks/use-outside-of-list-intersection.hook';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { isDefined } from 'src/utils/is-defined';

import { ActivityFeedItem } from './activity-feed-item';
import { useActivityFeedListStyles } from './activity-feed-list.styles';
import { ActivitySpinner } from './activity-spinner';
import { ActivityFeedSelectors } from './selectors';
import { getActivityDateSectionTitle } from './utils';

type ListItem = string | Activity;

const PROMOTION_ID = 'activities-promotion';
const ALL_ERRORED_TEXT = "Couldn't load activity. Pull to refresh to try again";

const getItemType = (item: ListItem) => (typeof item === 'string' ? 'sectionHeader' : 'row');

const keyExtractor = (item: ListItem) => (typeof item === 'string' ? item : toActivityKey(item));

interface Props {
  activities: Activity[];
  isInitialLoading: boolean;
  isEmpty: boolean;
  isAllErrored: boolean;
  isAllLoaded: boolean;
  isLoadingMore: boolean;
  isRefreshing?: boolean;
  withPromotion?: boolean;
  headerComponent?: ReactElement;
  emptyText?: string;
  onEndReached?: EmptyFn;
  onRefresh?: EmptyFn;
  pageName?: string;
}

export const ActivityFeedList = memo<Props>(
  ({
    activities,
    isInitialLoading,
    isEmpty,
    isAllErrored,
    isAllLoaded,
    isLoadingMore,
    isRefreshing = false,
    withPromotion = false,
    headerComponent,
    emptyText = 'No activity yet',
    onEndReached,
    onRefresh,
    pageName = ''
  }) => {
    const styles = useActivityFeedListStyles();
    const [listHeight, setListHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const handleContainerLayout = useCallback(
      (event: LayoutChangeEvent) => setListHeight(event.nativeEvent.layout.height),
      []
    );
    const handleHeaderLayout = useCallback(
      (event: LayoutChangeEvent) => setHeaderHeight(event.nativeEvent.layout.height),
      []
    );

    const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
    const { isHiddenTemporarily } = useAdTemporaryHiding(PROMOTION_ID, PromotionProviderEnum.HypeLab);
    const [endIsReached, setEndIsReached] = useState(false);
    const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
    const shouldShowPromotion =
      withPromotion && partnersPromotionEnabled && !promotionErrorOccurred && !isHiddenTemporarily;

    const handleEndReached = useCallback(() => {
      if (isAllLoaded) {
        return;
      }

      setEndIsReached(true);
      onEndReached?.();
    }, [isAllLoaded, onEndReached]);
    useEffect(() => setEndIsReached(false), [activities, isAllLoaded]);

    const handlePromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

    const sections = useMemo(() => {
      const result: ListItem[] = [];
      let prevTitle: string | undefined;

      for (const activity of activities) {
        const title = getActivityDateSectionTitle(activity.addedAt);

        if (title !== prevTitle) {
          result.push(title);
          prevTitle = title;
        }

        result.push(activity);
      }

      return result;
    }, [activities]);

    const adRef = useRef<View>(null);

    const { onAdLoad, onIsVisible, onAdImpression } = useInternalAdsAnalyticsWithImpressionCallback(pageName);

    const { onElementOrParentLayout } = useOutsideOfListIntersection(undefined, adRef, onIsVisible);

    const ListHeaderComponent = useMemo(() => {
      const promotionJsx = shouldShowPromotion ? (
        <PromotionItem
          ref={adRef}
          id={PROMOTION_ID}
          pageName={pageName}
          testID={ActivityFeedSelectors.promotion}
          style={styles.promotionItemWrapper}
          onLayout={onElementOrParentLayout}
          onError={handlePromotionError}
          onLoad={onAdLoad}
          onImpression={onAdImpression}
        />
      ) : null;

      // Always a measured wrapper: the empty state must know the header's height to center within the rest
      return (
        <View onLayout={handleHeaderLayout}>
          {headerComponent}
          {promotionJsx}
        </View>
      );
    }, [
      shouldShowPromotion,
      headerComponent,
      styles,
      onElementOrParentLayout,
      pageName,
      handlePromotionError,
      handleHeaderLayout,
      onAdLoad,
      onAdImpression
    ]);

    const ListEmptyComponent = useMemo(() => {
      // The list header renders above this component, so center within the remaining space only.
      // `minHeight`, not `height`: the content must stay reachable when the remainder is smaller than it
      const minHeight = Math.max(listHeight - headerHeight, 0);

      return (
        <View style={[styles.emptyListWrapper, { minHeight }]}>
          {listHeight <= 0 ? null : isInitialLoading ? (
            <ActivitySpinner size={32} />
          ) : isAllErrored ? (
            <DataPlaceholder text={ALL_ERRORED_TEXT} />
          ) : isEmpty ? (
            <DataPlaceholder text={emptyText} />
          ) : null}
        </View>
      );
    }, [isInitialLoading, isAllErrored, isEmpty, emptyText, styles, listHeight, headerHeight]);

    const renderItem: ListRenderItem<ListItem> = useCallback(
      ({ item }) =>
        typeof item === 'string' ? (
          <Text style={styles.sectionHeaderText}>{item}</Text>
        ) : (
          <ActivityFeedItem activity={item} />
        ),
      [styles]
    );

    const stickyHeaderIndices = useMemo(
      () => sections.map((item, index) => (typeof item === 'string' ? index : null)).filter(isDefined),
      [sections]
    );

    const shouldRenderAdditionalLoader = !isAllLoaded && (isLoadingMore || (endIsReached && sections.length > 0));

    const ListFooterComponent = useMemo(
      () =>
        shouldRenderAdditionalLoader ? (
          <View style={styles.additionalLoader}>
            <ActivitySpinner size={24} />
          </View>
        ) : null,
      [shouldRenderAdditionalLoader, styles.additionalLoader]
    );

    const refreshControl = useMemo(
      () => (onRefresh == null ? undefined : <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />),
      [onRefresh, isRefreshing]
    );

    return (
      <View style={styles.contentContainer} onLayout={handleContainerLayout}>
        <FlashList
          data={sections}
          stickyHeaderIndices={stickyHeaderIndices}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemType={getItemType}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          refreshControl={refreshControl}
        />
      </View>
    );
  }
);
