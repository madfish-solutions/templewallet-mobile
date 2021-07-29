import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  style?: StyleProp<TextStyle>;
  exchangeRate: number;
  children: string | BigNumber;
}

export const DollarValueText: FC<Props> = ({ style, exchangeRate, children }) =>
  isDefined(exchangeRate) ? (
    <Text style={style}>
      {formatAssetAmount(new BigNumber(Number(children) * exchangeRate), BigNumber.ROUND_DOWN, 2)} $
    </Text>
  ) : null;
