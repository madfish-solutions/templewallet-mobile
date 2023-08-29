import React, { FC } from 'react';
import { View } from 'react-native';

import { NonZeroAmounts } from '../../../../interfaces/non-zero-amounts.interface';
import { FormattedAmount } from '../../../formatted-amount';
import { useActivityGroupDollarAmountChangeStyles } from './activity-group-dollar-amount-change.styles';

interface Props {
  nonZeroAmounts: NonZeroAmounts;
}

export const ActivityGroupDollarAmountChange: FC<Props> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupDollarAmountChangeStyles();

  return (
    <View style={styles.container}>
      {nonZeroAmounts.dollarSums.map((amount, index) => (
        <FormattedAmount key={index} amount={amount} isDollarValue={true} style={styles.valueText} />
      ))}
    </View>
  );
};
