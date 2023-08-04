import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { formatSize } from 'src/styles/format-size';

import { ActivityDetails } from './activity-details';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { ActivityInfo } from './activity-info/activity-info';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();
  const firstActivity = group[0] ?? emptyActivity;
  const nonZeroAmounts = useNonZeroAmounts(firstActivity.tokensDeltas);

  return (
    <View style={styles.root}>
      <ActivityInfo activity={firstActivity} nonZeroAmounts={nonZeroAmounts} />
      <Divider size={formatSize(12)} />
      <ActivityDetails activity={firstActivity} nonZeroAmounts={nonZeroAmounts} />
    </View>
  );
};
