import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { SectionList, SectionListData, SectionListRenderItemInfo, Text, View } from 'react-native';

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

type RenderItem = SectionListRenderItemInfo<ActivityGroup, { title: string; data: ActivityGroup[] }>;
type RenderSectionHeader = {
  section: SectionListData<ActivityGroup, { title: string; data: ActivityGroup[] }>;
};

interface Props {
  activityGroups: ActivityGroup[];
  shouldShowPromotion?: boolean;
  handleUpdate?: () => void;
  onOptimalPromotionError?: () => void;
}

const SECTIONS_AMOUNT_TO_RENDER_PER_BATCH = 10;

const keyExtractor = (item: ActivityGroup) => item[0].hash;

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

    const onEndReached = useCallback(() => {
      if (!onEndReachedCalledDuringMomentum.current || sections.length < SECTIONS_AMOUNT_TO_RENDER_PER_BATCH) {
        handleUpdate();
        onEndReachedCalledDuringMomentum.current = true;
      }
    }, [handleUpdate, sections]);

    const onMomentumScrollBegin = useCallback(() => {
      onEndReachedCalledDuringMomentum.current = false;
    }, []);

    const renderItem = useCallback(
      ({ item, index, section }: RenderItem) => (
        <>
          <ActivityGroupItem group={item} />
          {index === 0 && section.title === sections[0].title && shouldShowPromotion && (
            <View style={styles.promotionItemWrapper}>
              <OptimalPromotionItem
                style={styles.promotionItem}
                testID={ActivityGroupsListSelectors.promotion}
                onImageError={onOptimalPromotionError}
                onEmptyPromotionReceived={onOptimalPromotionError}
              />
            </View>
          )}
        </>
      ),
      [sections]
    );

    const renderSectionHeader = useCallback(
      ({ section: { title } }: RenderSectionHeader) => <Text style={styles.sectionHeaderText}>{title}</Text>,
      []
    );

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
            maxToRenderPerBatch={SECTIONS_AMOUNT_TO_RENDER_PER_BATCH}
            disableVirtualization={true}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.sectionListContentContainer}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReached={onEndReached}
            keyExtractor={keyExtractor}
            bounces={false}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
          />
        )}
      </>
    );
  }
);
