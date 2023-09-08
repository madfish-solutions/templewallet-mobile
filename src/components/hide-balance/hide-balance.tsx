import React, { FC } from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { useHideBalance } from 'src/hooks/hide-balance/hide-balance.hook';

import { TruncatedText } from '../truncated-text';

interface Props {
  style: StyleProp<TextStyle>;
}

const hideSymbol = '•••••••';

export const HideBalance: FC<Props> = ({ style, children }) => {
  const { isBalanceHidden } = useHideBalance();

  return <TruncatedText style={style}>{isBalanceHidden ? hideSymbol : children}</TruncatedText>;
};
