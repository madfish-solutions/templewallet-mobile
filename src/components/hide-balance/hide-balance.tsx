import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';

interface Props {
  style: StyleProp<TextStyle>;
}

export const HideBalance: FC<Props> = ({ style, children }) => {
  const { balanceWrapper } = useHideBalance();

  return <Text style={style}>{balanceWrapper(children)}</Text>;
};
