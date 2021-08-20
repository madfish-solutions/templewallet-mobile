import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useHideBalance } from '../../hooks/hide-balance/hide-balance.hook';
import { getTruncatedProps } from '../../utils/style.util';

interface Props {
  style: StyleProp<TextStyle>;
}

const hideSymbol = '•••••••';

export const HideBalance: FC<Props> = ({ style, children }) => {
  const { isBalanceHidden } = useHideBalance();

  return <Text {...getTruncatedProps(style)}>{isBalanceHidden ? hideSymbol : children}</Text>;
};
