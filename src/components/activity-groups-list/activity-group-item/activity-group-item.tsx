import React, { FC, memo } from 'react';
import { View } from 'react-native';

import { ActivityGroup } from 'src/interfaces/activity.interface';

import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { ActivityItem } from './activity-item/activity-item';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = memo(({ group }) => {
  const styles = useActivityGroupItemStyles();

  return (
    <View>
      {group.map(activity => (
        <View style={styles.root} key={`${activity.id}_${activity.hash}`}>
          <ActivityItem activity={activity} />
        </View>
      ))}
    </View>
  );
});
