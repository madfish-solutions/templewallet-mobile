import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, TextStyle } from 'react-native';

import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  style: TextStyle;
  children: BigNumber | string[] | string;
  exchangeRate?: number;
}

export const BalanceText: FC<Props> = ({ style, exchangeRate, children }) => {
  const { balanceWrapper } = useHideBalance();

  const text = isDefined(exchangeRate)
    ? formatAssetAmount(new BigNumber(Number(children) * exchangeRate), BigNumber.ROUND_DOWN, 2) + ' $'
    : children;

  return <Text style={style}>{balanceWrapper(text as string)}</Text>;
};
