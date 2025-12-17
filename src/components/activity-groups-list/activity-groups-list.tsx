import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { PromotionItem } from 'src/components/promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { emptyFn } from 'src/config/general';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
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
const keyExtractor = (item: ListItem) => (typeof item === 'string' ? item : item[0].hash);

const AVERAGE_ITEM_HEIGHT = 150;
const PROMOTION_ID = 'activities-promotion';

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
  const { isHiddenTemporarily } = useAdTemporaryHiding(PROMOTION_ID, PromotionProviderEnum.HypeLab);
  const fakeRefreshControlProps = useFakeRefreshControlProps();
  const [endIsReached, setEndIsReached] = useState(false);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const shouldShowPromotion = partnersPromotionEnabled && !promotionErrorOccurred && !isHiddenTemporarily;

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

  const adRef = useRef<View>(null);

  const { onAdLoad, onIsVisible } = useInternalAdsAnalytics(pageName);

  const { onElementOrParentLayout } = useOutsideOfListIntersection(undefined, adRef, onIsVisible);

  const ListHeaderComponent = useMemo(
    () =>
      shouldShowPromotion ? (
        <PromotionItem
          ref={adRef}
          id={PROMOTION_ID}
          pageName={pageName}
          testID={ActivityGroupsListSelectors.promotion}
          style={styles.promotionItemWrapper}
          onLayout={onElementOrParentLayout}
          onError={handlePromotionError}
          onLoad={onAdLoad}
        />
      ) : undefined,
    [shouldShowPromotion, styles, onElementOrParentLayout, pageName, handlePromotionError, onAdLoad]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyListWrapper}>
        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <DataPlaceholder text="No operations yet." />
        )}
      </View>
    ),
    [isLoading, styles]
  );

  const renderItem: ListRenderItem<string | ActivityGroup> = useCallback(
    ({ item }) =>
      typeof item === 'string' ? (
        <Text style={styles.sectionHeaderText}>{item}</Text>
      ) : (
        <ActivityGroupItem group={item} />
      ),
    [styles]
  );

  const stickyHeaderIndices = useMemo(
    () => sections.map((item, index) => (typeof item === 'string' ? index : null)).filter(isDefined),
    [sections]
  );

  const shouldRenderAdditionalLoader = !isAllLoaded && endIsReached && sections.length > 0;
  const renderAdditionalLoader = useCallback(
    () => (shouldRenderAdditionalLoader ? <ActivityIndicator style={styles.additionalLoader} size="large" /> : null),
    [shouldRenderAdditionalLoader, styles.additionalLoader]
  );

  return (
    <View style={styles.contentContainer}>
      <FlashList
        data={sections}
        stickyHeaderIndices={stickyHeaderIndices}
        onEndReachedThreshold={0.01}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={AVERAGE_ITEM_HEIGHT}
        getItemType={getItemType}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={renderAdditionalLoader}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
      />
    </View>
  );
};
