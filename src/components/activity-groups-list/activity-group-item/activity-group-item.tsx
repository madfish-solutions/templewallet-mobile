import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { formatSize } from 'src/styles/format-size';

import { ActivityGroupAmountChange } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityDetails } from './activity-group-details';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { useActivityGroupInfo } from './activity-group-type/use-activity-group-info.hook';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();

  const {
    transactionType,
    transactionSubtype,
    transactionHash,
    destination: { label, value, address }
  } = useActivityGroupInfo(group);
  const nonZeroAmounts = useNonZeroAmounts(group);

  const firstActivity = group[0] ?? emptyActivity;

  return (
    <View style={styles.root}>
      <View style={[styles.row, styles.itemsCenter]}>
        <RobotIcon size={formatSize(36)} seed={firstActivity.reciever?.address ?? ''} style={styles.robotBackground} />
        <Divider size={formatSize(10)} />
        <View style={styles.flex}>
          <View style={[styles.row, styles.justifyBetween, styles.itemsStart]}>
            <Text style={styles.oprationTitle}>{transactionType}</Text>
            <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
          </View>
          <View style={[styles.row, styles.justifyBetween, styles.itemsStart]}>
            <Text style={styles.oprationSubtitle}>
              {label} {value}
            </Text>
            <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
          </View>
        </View>
      </View>
      <Divider size={formatSize(12)} />
      <ActivityDetails
        activity={firstActivity}
        nonZeroAmounts={nonZeroAmounts}
        label={label}
        address={address}
        transactionHash={transactionHash}
        transactionType={transactionType}
        transactionSubtype={transactionSubtype}
      />
    </View>
  );
};
