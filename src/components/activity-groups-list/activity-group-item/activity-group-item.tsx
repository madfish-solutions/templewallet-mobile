import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { formatSize } from 'src/styles/format-size';

import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { Details } from './details';
import { Info } from './info/info';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();
  const firstActivity = group[0] ?? emptyActivity;
  const nonZeroAmounts = useNonZeroAmounts(firstActivity.tokensDeltas);

  return (
    <View style={styles.root}>
      <Info activity={firstActivity} nonZeroAmounts={nonZeroAmounts} />
      <Divider size={formatSize(12)} />
      <Details activity={firstActivity} nonZeroAmounts={nonZeroAmounts} />
    </View>
  );
};
