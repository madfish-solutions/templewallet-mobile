import { BigNumber } from 'bignumber.js';
import React, { FC, memo } from 'react';
import { View, Text } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { ZERO } from 'src/config/swap';

import { useActivityGroupDollarAmountChangeStyles } from './activity-group-dollar-amount-change.styles';

interface Props {
  dollarValue: BigNumber | undefined;
}

export const ActivityGroupDollarAmountChange: FC<Props> = memo(
  ({ dollarValue }) => {
    const styles = useActivityGroupDollarAmountChangeStyles();

    if (dollarValue === undefined || dollarValue.isEqualTo(ZERO)) {
      return (
        <View style={styles.container}>
          <Text style={styles.valueText}>---</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FormattedAmount isDollarValue amount={dollarValue} style={styles.valueText} />
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.dollarValue?.toFixed() === nextProps.dollarValue?.toFixed()
);
