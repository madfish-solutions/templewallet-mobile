import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue } from 'src/utils/activity.utils';
import { truncateLongAddress } from 'src/utils/address.utils';

import { ActivityGroupAmountChange } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityGroupItemStyles } from '../activity-group-item.styles';

export const Receive: FC<{ address: string; nonZeroAmounts: Array<ActivityAmount> }> = ({
  address,
  nonZeroAmounts
}) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <RobotIcon size={formatSize(36)} seed={address} style={styles.robotBackground} />
      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Receive</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>From: {truncateLongAddress(address)}</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};
