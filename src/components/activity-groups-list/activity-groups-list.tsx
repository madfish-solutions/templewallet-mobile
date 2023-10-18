import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { emptyFn } from 'src/config/general';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { isTheSameDay, isToday, isYesterday } from 'src/utils/date.utils';

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
  shouldShowPromotion?: boolean;
  handleUpdate?: () => void;
  onOptimalPromotionError?: () => void;
}

export const ActivityGroupsList: FC<Props> = ({
  activityGroups,
  handleUpdate = emptyFn,
  shouldShowPromotion = false,
  onOptimalPromotionError
}) => {
  const styles = useActivityGroupsListStyles();

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const sections = useMemo(() => {
    const result: ListItem[] = [];
    let prevActivityDate = new Date(-1);

    for (const activityGroup of activityGroups) {
      const firstActivity = activityGroup[0] ?? emptyActivity;
      const date = new Date(firstActivity.timestamp);
      const lastActivityGroup = result[result.length - 1];

      if (isTheSameDay(date, prevActivityDate) && Array.isArray(lastActivityGroup)) {
        lastActivityGroup.concat(activityGroup);
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
    [onOptimalPromotionError]
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
    [onOptimalPromotionError, shouldShowPromotion]
  );

  const stickyHeaderIndices = useMemo(
    () =>
      sections
        .map((item, index) => {
          if (typeof item === 'string') {
            return index;
          } else {
            return null;
          }
        })
        .filter(item => item !== null) as number[],
    [sections]
  );

  return (
    <>
      {sections.length === 0 && shouldShowPromotion && Promotion}
      <View style={styles.contentContainer}>
        <FlashList
          data={sections}
          stickyHeaderIndices={stickyHeaderIndices}
          onEndReachedThreshold={0.01}
          onEndReached={handleUpdate}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={AVERAGE_ITEM_HEIGHT}
          getItemType={getItemType}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        />
      </View>
    </>
  );
};
