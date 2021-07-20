import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  balance: string;
  exchangeRate: number | undefined;
  style: StyleProp<TextStyle>;
}

export const DollarEquivalentText: FC<Props> = ({ balance, exchangeRate, style }) => {
  let formattedDollarEquivalent = null;
  if (isDefined(exchangeRate)) {
    formattedDollarEquivalent = formatAssetAmount(
      new BigNumber(Number(balance) * exchangeRate),
      BigNumber.ROUND_DOWN,
      2
    );
  }

  return formattedDollarEquivalent ? <Text style={style}>{formattedDollarEquivalent} $</Text> : null;
};
