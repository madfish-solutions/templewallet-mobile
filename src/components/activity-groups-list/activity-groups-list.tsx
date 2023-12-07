import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { emptyFn } from 'src/config/general';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { usePartnersPromoLoad } from 'src/hooks/use-partners-promo';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { isTheSameDay, isToday, isYesterday } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityGroupItem } from './activity-group-item/activity-group-item';
import { ActivityGroupsListSelectors } from './activity-groups-list.selectors';
import { useActivityGroupsListStyles } from './activity-groups-list.styles';

type ListItem = string | ActivityGroup;

const keyExtractor = (item: ListItem) => (typeof item === 'string' ? item : item[0].hash);
const getItemType = (item: ListItem) => (typeof item === 'string' ? 'sectionHeader' : 'row');

const ListEmptyComponent = <DataPlaceholder text="No Activity records were found" />;

const AVERAGE_ITEM_HEIGHT = 150;

interface Props {
  activityGroups: ActivityGroup[];
  isAllLoaded?: boolean;
  isLoading?: boolean;
  handleUpdate?: () => void;
}

export const ActivityGroupsList: FC<Props> = ({
  activityGroups,
  isAllLoaded = false,
  isLoading = false,
  handleUpdate = emptyFn
}) => {
  usePartnersPromoLoad();

  const styles = useActivityGroupsListStyles();

  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const fakeRefreshControlProps = useFakeRefreshControlProps();
  const [endIsReached, setEndIsReached] = useState(false);
  const [loadingEnded, setLoadingEnded] = useState(!isLoading);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const shouldShowPromotion = partnersPromotionEnabled && !promotionErrorOccurred;

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

  const onOptimalPromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

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

  const Promotion = useMemo(
    () => (
      <View style={styles.promotionItemWrapper}>
        <OptimalPromotionItem
          style={styles.promotionItem}
          testID={ActivityGroupsListSelectors.promotion}
          onImageError={onOptimalPromotionError}
          onEmptyPromotionReceived={onOptimalPromotionError}
        />
      </View>
    ),
    [onOptimalPromotionError, styles]
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

  if (sections.length > 0) {
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
          ListFooterComponent={renderAdditionalLoader}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        />
      </View>
    );
  }

  return (
    <>
      {shouldShowPromotion && <View style={styles.adContainer}>{Promotion}</View>}
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
