import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  style?: StyleProp<TextStyle>;
  tokenSymbol?: string;
  children: string | BigNumber;
}

export const TokenValueText: FC<Props> = ({ style, tokenSymbol, children }) => (
  <Text style={style}>
    {formatAssetAmount(new BigNumber(children))} {isDefined(tokenSymbol) ? tokenSymbol : null}
  </Text>
);
