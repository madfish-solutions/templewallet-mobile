import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { useSwapRouteInfoStyles } from './swap-route-info.styles';

interface Props {
  text: string;
}

export const SwapRouteInfo: FC<Props> = ({ text }) => {
  const styles = useSwapRouteInfoStyles();

  return (
    <View style={styles.container}>
      <SwapRouteItem />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
