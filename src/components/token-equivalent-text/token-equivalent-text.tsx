import React, { FC } from 'react';
import { Text, TextStyle } from 'react-native';

import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';

interface Props {
  style: TextStyle;
}

export const TokenEquivalentText: FC<Props> = ({ style, children }) => {
  const { isBalanceHidden, hideSymbol } = useHideBalance();

  return <Text style={style}>{!isBalanceHidden ? children : hideSymbol}</Text>;
};
