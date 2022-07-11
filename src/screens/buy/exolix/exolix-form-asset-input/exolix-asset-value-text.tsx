import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

// import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { isDefined } from '../../../../utils/is-defined';
import { formatAssetAmount } from '../../../../utils/number.util';

interface Props {
  amount?: BigNumber;
  // asset: CurrenciesInterface;
  style?: StyleProp<TextStyle>;
}

export const ExolixAssetValueText: FC<Props> = ({ amount, style }) => {
  return <Text style={style}>{formatAssetAmount(isDefined(amount) ? amount : new BigNumber(0))}</Text>;
};
