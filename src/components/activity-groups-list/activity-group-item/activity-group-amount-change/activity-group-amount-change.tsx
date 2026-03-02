import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatAssetAmount } from 'src/utils/number.util';

import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  nonZeroAmounts: NonZeroAmounts;
}

export const ActivityGroupAmountChange: FC<Props> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupAmountChangeStyles();

  return (
    <View style={styles.container}>
      {nonZeroAmounts.amounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text key={index} style={[styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)]}>
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {symbol}
        </Text>
      ))}
    </View>
  );
};
