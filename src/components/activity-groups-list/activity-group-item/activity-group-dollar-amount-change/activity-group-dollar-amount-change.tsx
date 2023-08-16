import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { ZERO } from 'src/config/swap';

import { useActivityGroupDollarAmountChangeStyles } from './activity-group-dollar-amount-change.styles';

interface Props {
  dollarValue: BigNumber;
}

export const ActivityGroupDollarAmountChange: FC<Props> = ({ dollarValue }) => {
  const styles = useActivityGroupDollarAmountChangeStyles();

  if (dollarValue.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FormattedAmount isDollarValue amount={dollarValue} style={styles.valueText} />
    </View>
  );
};
