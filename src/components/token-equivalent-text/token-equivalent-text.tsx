import React, { FC } from 'react';
import { Text, TextStyle } from 'react-native';

import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';

interface Props {
  style: TextStyle;
}

export const TokenEquivalentText: FC<Props> = ({ style, children }) => {
  const { balanceWrapper } = useHideBalance();

  return <Text style={style}>{balanceWrapper(children)}</Text>;
};
