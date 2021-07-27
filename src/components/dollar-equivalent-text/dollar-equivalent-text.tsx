import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';

import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

interface Props {
  balance: string | BigNumber;
  exchangeRate?: number;
  style?: StyleProp<TextStyle>;
}

export const DollarEquivalentText: FC<Props> = ({ balance, exchangeRate, style }) => {
  const { isBalanceHidden, hideSymbol } = useHideBalance();

  return isDefined(exchangeRate) ? (
    <Text style={style}>
      {!isBalanceHidden
        ? formatAssetAmount(new BigNumber(Number(balance) * exchangeRate), BigNumber.ROUND_DOWN, 2) + ' $'
        : hideSymbol}
    </Text>
  ) : null;
};
