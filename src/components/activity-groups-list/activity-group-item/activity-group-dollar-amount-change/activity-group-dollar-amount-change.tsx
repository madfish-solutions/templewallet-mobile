import { BigNumber } from 'bignumber.js';
import { clamp, inRange } from 'lodash-es';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { conditionalStyle } from '../../../../utils/conditional-style';
import { roundFiat } from '../../../../utils/number.util';
import { NonZeroAmounts } from '../activity-group-item';
import { useActivityGroupDollarAmountChangeStyles } from './activity-group-dollar-amount-change.styles';

interface Props {
  nonZeroAmounts: NonZeroAmounts;
}

const MIN_POSITIVE_AMOUNT_VALUE = 0.01;
const MAX_NEGATIVE_AMOUNT_VALUE = -0.01;

export const ActivityGroupDollarAmountChange: FC<Props> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupDollarAmountChangeStyles();

  return (
    <View style={styles.container}>
      {nonZeroAmounts.dollarSums.map((amount, index) => (
        <Text
          key={index}
          style={[styles.valueText, conditionalStyle(amount > 0, styles.positiveAmountText, styles.negativeAmountText)]}
        >
          {inRange(amount, MAX_NEGATIVE_AMOUNT_VALUE, MIN_POSITIVE_AMOUNT_VALUE) && '≈ '}
          {amount > 0 ? '+ ' : '- '}
          {roundFiat(
            new BigNumber(
              amount > 0 ? clamp(amount, MIN_POSITIVE_AMOUNT_VALUE, Infinity) : clamp(amount, MAX_NEGATIVE_AMOUNT_VALUE)
            ).abs()
          ).toFixed()}
          {' $'}
        </Text>
      ))}
    </View>
  );
};
