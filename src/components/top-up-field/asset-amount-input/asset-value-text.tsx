import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';

interface Props {
  amount?: BigNumber;
  style?: StyleProp<TextStyle>;
}

export const TopUpAssetValueText: FC<Props> = ({ amount, style }) => {
  return <Text style={style}>{formatAssetAmount(isDefined(amount) ? amount : new BigNumber(0), 8)}</Text>;
};
