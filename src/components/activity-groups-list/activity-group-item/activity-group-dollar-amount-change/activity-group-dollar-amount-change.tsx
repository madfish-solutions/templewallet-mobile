import React, { FC } from 'react';
import { View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useActivityGroupDollarAmountChangeStyles } from './activity-group-dollar-amount-change.styles';

interface Props {
  nonZeroAmounts: NonZeroAmounts;
}

export const ActivityGroupDollarAmountChange: FC<Props> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupDollarAmountChangeStyles();

  return (
    <View style={styles.container}>
      {nonZeroAmounts.dollarSums.map((amount, index) => (
        <FormattedAmount
          key={index}
          amount={amount}
          isDollarValue={true}
          showMinusSign={amount.isLessThan(0)}
          showPlusSign={amount.isGreaterThan(0)}
          style={[
            styles.valueText,
            conditionalStyle(amount.isGreaterThan(0), styles.positiveAmountText, styles.negativeAmountText)
          ]}
        />
      ))}
    </View>
  );
};
