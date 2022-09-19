import React, { FC, useMemo, useState } from 'react';
import { RefreshControl, SectionList, Text } from 'react-native';

import { emptyFn } from '../../config/general';
import { ActivityGroup, emptyActivity } from '../../interfaces/activity.interface';
import { isTheSameDay, isToday, isYesterday } from '../../utils/date.utils';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { ActivityGroupItem } from './activity-group-item/activity-group-item';
import { useActivityGroupsListStyles } from './activity-groups-list.styles';

interface Props {
  activityGroups: ActivityGroup[];
  handleUpdate?: () => void;
}

export const ActivityGroupsList: FC<Props> = ({ activityGroups, handleUpdate = emptyFn }) => {
  const styles = useActivityGroupsListStyles();

  const [isRefreshing, setRefreshing] = useState(false);

  const sections = useMemo(() => {
    const result = [];
    let prevActivityDate = new Date(-1);

    for (const activityGroup of activityGroups) {
      const firstActivity = activityGroup[0] ?? emptyActivity;
      const date = new Date(firstActivity.timestamp);

      if (isTheSameDay(date, prevActivityDate)) {
        result[result.length - 1].data.push(activityGroup);
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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, Math.random() * 2000 + 2000);
  };

  const isShowPlaceholder = useMemo(() => activityGroups.length === 0, [activityGroups]);

  return isShowPlaceholder ? (
    <DataPlaceholder text="No Activity records were found" />
  ) : (
    <>
      <SectionList
        sections={sections}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.sectionListContentContainer}
        onEndReachedThreshold={0.01}
        onEndReached={handleUpdate}
        keyExtractor={item => item[0].hash}
        renderItem={({ item }) => <ActivityGroupItem group={item} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeaderText}>{title}</Text>}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      />
    </>
  );
};
