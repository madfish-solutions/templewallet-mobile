import React, { FC, useMemo } from 'react';
import { SectionList, Text } from 'react-native';

import { ActivityGroup, emptyActivity } from '../../interfaces/activity.interface';
import { isTheSameDay, isToday, isYesterday } from '../../utils/date.utils';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { ActivityGroupItem } from './activity-group-item/activity-group-item';
import { useActivityGroupsListStyles } from './activity-groups-list.styles';

interface Props {
  activityGroups: ActivityGroup[];
}

export const ActivityGroupsList: FC<Props> = ({ activityGroups }) => {
  const styles = useActivityGroupsListStyles();

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

  const isShowPlaceholder = activityGroups.length === 0;

  return isShowPlaceholder ? (
    <DataPlaceholder text="No Activity records were found" />
  ) : (
    <SectionList
      sections={sections}
      stickySectionHeadersEnabled={true}
      contentContainerStyle={styles.sectionListContentContainer}
      keyExtractor={(item, index) => item[0].hash + index}
      renderItem={({ item }) => <ActivityGroupItem group={item} />}
      renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeaderText}>{title}</Text>}
    />
  );
};
