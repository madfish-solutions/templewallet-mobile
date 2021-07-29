import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  balance: string | BigNumber;
  tokenSymbol?: string;
  style?: StyleProp<TextStyle>;
}

export const TokenValueText: FC<Props> = ({ balance, tokenSymbol, style }) => {
  const bigNumberBalance = balance instanceof BigNumber ? balance : new BigNumber(balance);

  return (
    <Text style={style}>
      {formatAssetAmount(bigNumberBalance)}
      {isDefined(tokenSymbol) ? ` ${tokenSymbol}` : null}
    </Text>
  );
};
