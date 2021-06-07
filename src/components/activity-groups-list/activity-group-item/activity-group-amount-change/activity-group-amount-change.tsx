import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupAmountChange: FC<Props> = ({ group }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const nonZeroAmounts = useMemo(() => group.filter(({ amount }) => !amount.isEqualTo(0)), [group]);
  const isShowValueText = nonZeroAmounts.length > 0;

  return (
    <View style={styles.container}>
      {nonZeroAmounts.map(({ amount, tokenSymbol }, index) => {
        const isPositive = amount.isPositive();

        return (
          <Text key={index} style={[styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)]}>
            {isPositive && '+'}
            {amount.toString()} {tokenSymbol}
          </Text>
        );
      })}

      {isShowValueText && <Text style={styles.valueText}>XX.XX $</Text>}
    </View>
  );
};
