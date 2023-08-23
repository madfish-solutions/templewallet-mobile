import React, { FC, memo, useMemo, useRef } from 'react';
import { SectionList, Text, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useFakeRefreshControlProps } from '../../hooks/use-fake-refresh-control-props.hook';
import { ActivityGroup, emptyActivity } from '../../interfaces/activity.interface';
import { isTheSameDay, isToday, isYesterday } from '../../utils/date.utils';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { OptimalPromotionItem } from '../optimal-promotion-item/optimal-promotion-item';
import { RefreshControl } from '../refresh-control/refresh-control';
import { ActivityGroupItem } from './activity-group-item/activity-group-item';
import { ActivityGroupsListSelectors } from './activity-groups-list.selectors';
import { useActivityGroupsListStyles } from './activity-groups-list.styles';

interface Props {
  activityGroups: ActivityGroup[];
  shouldShowPromotion?: boolean;
  handleUpdate?: () => void;
  onOptimalPromotionError?: () => void;
}

const renderItem = (item: ActivityGroup) => <ActivityGroupItem group={item} />;

export const ActivityGroupsList: FC<Props> = memo(
  ({ activityGroups, handleUpdate = emptyFn, shouldShowPromotion = false, onOptimalPromotionError }) => {
    const styles = useActivityGroupsListStyles();

    const onEndReachedCalledDuringMomentum = useRef<boolean>(false);

    const fakeRefreshControlProps = useFakeRefreshControlProps();

    const sections = useMemo(() => {
      const result = [];
      let prevActivityDate = new Date(-1);

      for (const activityGroup of activityGroups) {
        const firstActivity = activityGroup[0] ?? emptyActivity;
        const date = new Date(firstActivity.timestamp);

        if (isTheSameDay(date, prevActivityDate)) {
          result[result.length - 1]?.data.push(activityGroup);
        } else {
          let title = date.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

          isToday(date) && (title = 'Today');
          isYesterday(date) && (title = 'Yesterday');

          result.push({ title, data: [activityGroup] });
        }

        prevActivityDate = date;
      }

      return result;
    }, [activityGroups]);

    const isShowPlaceholder: boolean = useMemo(() => activityGroups.length === 0, [activityGroups]);

    return (
      <>
        {isShowPlaceholder ? (
          <>
            {shouldShowPromotion && (
              <View style={styles.promotionItemWrapper}>
                <OptimalPromotionItem
                  style={[styles.promotionItem, styles.centeredItem]}
                  testID={ActivityGroupsListSelectors.promotion}
                  onImageError={onOptimalPromotionError}
                  onEmptyPromotionReceived={onOptimalPromotionError}
                />
              </View>
            )}
            <DataPlaceholder text="No Activity records were found" />
          </>
        ) : (
          <SectionList
            sections={sections}
            maxToRenderPerBatch={10}
            disableVirtualization={true}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.sectionListContentContainer}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current || sections.length < 10) {
                handleUpdate();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            keyExtractor={item => item[0].hash}
            bounces={false}
            renderItem={({ item }) => renderItem(item)}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeaderText}>{title}</Text>}
            refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
          />
        )}
      </>
    );
  }
);
