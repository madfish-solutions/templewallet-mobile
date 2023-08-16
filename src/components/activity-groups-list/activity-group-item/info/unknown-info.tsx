import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { calculateDollarValue } from 'src/utils/activity.utils';

import { ActivityGroupAmountChange } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityGroupItemStyles } from '../activity-group-item.styles';

export const UnknownInfo: FC<{ nonZeroAmounts: Array<ActivityAmount> }> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Interaction</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>-</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};
