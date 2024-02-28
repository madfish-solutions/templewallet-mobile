import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { PromotionItem } from 'src/components/promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { emptyFn } from 'src/config/general';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
import { useListElementIntersection } from 'src/hooks/use-list-element-intersection.hook';
import { useOutsideOfListIntersection } from 'src/hooks/use-outside-of-list-intersection.hook';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { isTheSameDay, isToday, isYesterday } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityGroupItem } from './activity-group-item/activity-group-item';
import { ActivityGroupsListSelectors } from './activity-groups-list.selectors';
import { useActivityGroupsListStyles } from './activity-groups-list.styles';

type ListItem = string | ActivityGroup;

const getItemType = (item: ListItem) => (typeof item === 'string' ? 'sectionHeader' : 'row');

const ListEmptyComponent = <DataPlaceholder text="No Activity records were found" />;

const AVERAGE_ITEM_HEIGHT = 150;
export const PROMOTION_ID = 'activities-promotion';

interface Props {
  activityGroups: ActivityGroup[];
  isAllLoaded?: boolean;
  isLoading?: boolean;
  handleUpdate?: () => void;
  pageName: string;
}

export const ActivityGroupsList: FC<Props> = ({
  activityGroups,
  isAllLoaded = false,
  isLoading = false,
  handleUpdate = emptyFn,
  pageName
}) => {
  const styles = useActivityGroupsListStyles();

  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(PROMOTION_ID);
  const fakeRefreshControlProps = useFakeRefreshControlProps();
  const [endIsReached, setEndIsReached] = useState(false);
  const [loadingEnded, setLoadingEnded] = useState(!isLoading);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const shouldShowPromotion = partnersPromotionEnabled && !promotionErrorOccurred && !isHiddenTemporarily;

  const keyExtractor = useCallback(
    (item: ListItem, index: number) => {
      const keyRoot = typeof item === 'string' ? item : item[0].hash;

      if (index === 1 && shouldShowPromotion) {
        return `${keyRoot}-with-promotion`;
      }

      return keyRoot;
    },
    [shouldShowPromotion]
  );

  useEffect(() => {
    if (!isLoading) {
      setLoadingEnded(true);
    }
  }, [isLoading]);

  const handleEndReached = useCallback(() => {
    setEndIsReached(true);
    handleUpdate();
  }, [handleUpdate]);
  useEffect(() => setEndIsReached(false), [activityGroups]);

  const handlePromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

  const sections = useMemo(() => {
    const result: ListItem[] = [];
    let prevActivityDate = new Date(-1);

    for (const activityGroup of activityGroups) {
      const firstActivity = activityGroup[0] ?? emptyActivity;
      const date = new Date(firstActivity.timestamp);

      if (isTheSameDay(date, prevActivityDate)) {
        result.push(activityGroup);
      } else {
        let title = date.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

        isToday(date) && (title = 'Today');
        isYesterday(date) && (title = 'Yesterday');

        result.push(title, activityGroup);
      }

      prevActivityDate = date;
    }

    return result;
  }, [activityGroups]);
  const shouldRenderList = sections.length > 0;

  const adRef = useRef<View>(null);
  const separateAdParentRef = useRef<View>(null);

  const { onAdLoad, resetAdState, onIsVisible } = useInternalAdsAnalytics(pageName);
  const {
    onListScroll,
    onElementLayoutChange: onListAdLayoutChange,
    onListLayoutChange,
    onUnmount: onListAdUnmount
  } = useListElementIntersection(onIsVisible);
  const { onElementOrParentLayout: onSeparateAdOrParentLayout, onUnmount: onSeparateAdUnmount } =
    useOutsideOfListIntersection(separateAdParentRef, adRef, onIsVisible);

  useEffect(() => {
    if (shouldRenderList) {
      onSeparateAdUnmount();
    } else {
      onListAdUnmount();
    }
    resetAdState();
  }, [onListAdUnmount, onSeparateAdUnmount, resetAdState, shouldRenderList]);

  const handlePromotionLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (shouldRenderList) {
        onListAdLayoutChange(e);
      } else {
        onSeparateAdOrParentLayout();
      }
    },
    [onListAdLayoutChange, onSeparateAdOrParentLayout, shouldRenderList]
  );

  const Promotion = useMemo(
    () => (
      <View style={styles.promotionItemWrapper} onLayout={handlePromotionLayout}>
        <PromotionItem
          id={PROMOTION_ID}
          style={styles.promotionItem}
          testID={ActivityGroupsListSelectors.promotion}
          ref={adRef}
          onError={handlePromotionError}
          onLoad={onAdLoad}
        />
      </View>
    ),
    [styles, handlePromotionLayout, handlePromotionError, onAdLoad]
  );

  const renderItem: ListRenderItem<string | ActivityGroup> = useCallback(
    ({ item, index }) =>
      typeof item === 'string' ? (
        <Text style={styles.sectionHeaderText}>{item}</Text>
      ) : (
        <>
          <ActivityGroupItem group={item} />
          {index === 1 && shouldShowPromotion && Promotion}
        </>
      ),
    [shouldShowPromotion, styles, Promotion]
  );

  const stickyHeaderIndices = useMemo(
    () => sections.map((item, index) => (typeof item === 'string' ? index : null)).filter(isDefined),
    [sections]
  );

  const shouldRenderAdditionalLoader = !isAllLoaded && endIsReached;
  const renderAdditionalLoader = useCallback(
    () => (shouldRenderAdditionalLoader ? <ActivityIndicator style={styles.additionalLoader} size="large" /> : null),
    [shouldRenderAdditionalLoader, styles.additionalLoader]
  );

  if (shouldRenderList) {
    return (
      <View style={styles.contentContainer}>
        <FlashList
          data={sections}
          stickyHeaderIndices={stickyHeaderIndices}
          onEndReachedThreshold={0.01}
          onEndReached={handleEndReached}
          onLayout={onListLayoutChange}
          onScroll={onListScroll}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={AVERAGE_ITEM_HEIGHT}
          getItemType={getItemType}
          ListFooterComponent={renderAdditionalLoader}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        />
      </View>
    );
  }

  return (
    <>
      {shouldShowPromotion && (
        <View style={styles.adContainer} ref={separateAdParentRef} onLayout={onSeparateAdOrParentLayout}>
          {Promotion}
        </View>
      )}
      <View style={styles.emptyListWrapper}>
        {loadingEnded ? (
          ListEmptyComponent
        ) : (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </>
  );
};
