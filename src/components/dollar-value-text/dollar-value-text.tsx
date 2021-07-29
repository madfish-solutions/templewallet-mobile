import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  balance: string | BigNumber;
  exchangeRate: number;
  style?: StyleProp<TextStyle>;
}

export const DollarValueText: FC<Props> = ({ balance, exchangeRate, style }) => {
  const bigNumberBalance = balance instanceof BigNumber ? balance : new BigNumber(balance);

  return isDefined(exchangeRate) ? (
    <Text style={style}>
      {formatAssetAmount(bigNumberBalance.multipliedBy(exchangeRate), BigNumber.ROUND_DOWN, 2)} $
    </Text>
  ) : null;
};
