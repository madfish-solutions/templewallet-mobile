import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { formatSize } from '../../../../styles/format-size';
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
      <Divider size={formatSize(16)} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
