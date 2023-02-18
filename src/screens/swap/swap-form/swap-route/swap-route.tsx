import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useRoute3SwapParamsSelector } from 'src/store/route3/route3-selectors';

import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { useSwapRouteStyles } from './swap-route.styles';

export const SwapRoute: FC = () => {
  const styles = useSwapRouteStyles();
  const { data: swapParams } = useRoute3SwapParamsSelector();
  const [isRouteVisible, setIsVisible] = useState(false);

  const totalChains = swapParams.chains.length;
  const totalHops = swapParams.chains.reduce((accum, chain) => accum + chain.hops.length, 0);
  const shouldShowRoute = isRouteVisible && swapParams.chains.length > 0;
  const iconName = isRouteVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown;

  const toggleRoutePress = () => setIsVisible(prevState => !prevState);

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.flex, styles.mb12, { width: '100%' }]}>
        <Text style={styles.infoText}>Swap route</Text>
        <View style={styles.row}>
          <Text style={styles.infoValue}>
            {totalChains} chains / {totalHops} dexes
          </Text>
          <Divider size={12} />
          <TouchableOpacity onPress={toggleRoutePress}>
            <Icon name={iconName} />
          </TouchableOpacity>
        </View>
      </View>
      {shouldShowRoute &&
        swapParams.chains.map((chain, index) => (
          <View style={[styles.row, styles.flex, styles.mb8]}>
            <SwapRouteItem key={index} chain={chain} />
          </View>
        ))}
    </View>
  );
};
