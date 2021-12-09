import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { bigIntClamp } from '../utils/big-number.utils';
import { formatAssetAmount } from '../utils/number.util';

interface Props {
  amount: BigNumber;
  isDollarValue?: boolean;
  showMinusSign?: boolean;
  showPlusSign?: boolean;
  symbol?: string;
  style?: StyleProp<TextStyle>;
}

const MIN_POSITIVE_AMOUNT_VALUE = new BigNumber(0.01);
const MAX_NEGATIVE_AMOUNT_VALUE = new BigNumber(-0.01);

export const FormattedAmount: FC<Props> = ({
  amount,
  isDollarValue = false,
  showMinusSign = false,
  showPlusSign = false,
  symbol,
  style
}) => {
  const dollarAmount = amount.isZero()
    ? amount
    : amount.isPositive()
    ? bigIntClamp(amount, MIN_POSITIVE_AMOUNT_VALUE, new BigNumber(Infinity))
    : bigIntClamp(amount, new BigNumber(-Infinity), MAX_NEGATIVE_AMOUNT_VALUE).abs();

  const formattedAmount = isDollarValue ? formatAssetAmount(dollarAmount, 2) : formatAssetAmount(amount);

  return (
    <Text style={style}>
      {isDollarValue && '≈ '}
      {showMinusSign && '- '}
      {showPlusSign && '+ '}
      {formattedAmount}
      {isDollarValue ? ' $' : `${symbol}`}
    </Text>
  );
};
