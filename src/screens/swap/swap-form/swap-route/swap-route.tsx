import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useSwapParamsSelector } from 'src/store/swap/swap-selectors';

import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { useSwapRouteStyles } from './swap-route.styles';

export const SwapRoute = () => {
  const styles = useSwapRouteStyles();
  const [isRouteVisible, setIsVisible] = useState(false);
  const {
    data: { chains, input, output }
  } = useSwapParamsSelector();

  useEffect(() => {
    if (chains.length === 0) {
      setIsVisible(false);
    }
  }, [chains]);

  const totalChains = chains.length;
  const totalHops = chains.reduce((accum, chain) => accum + chain.hops.length, 0);
  const shouldShowRoute = isRouteVisible && chains.length > 0;

  const iconName = isRouteVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown;

  const toggleRoutePress = () => setIsVisible(prevState => !prevState);

  return (
    <View>
      <TouchableOpacity
        style={[styles.flex, styles.row, styles.mb12]}
        onPress={toggleRoutePress}
        disabled={!Boolean(output)}
      >
        <Text style={styles.infoText}>Swap route</Text>
        <View style={styles.row}>
          <Text style={styles.infoValue}>
            {totalChains} chains / {totalHops} dexes
          </Text>
          <Divider size={12} />
          <Icon name={iconName} color={!Boolean(output) ? '#DDDDDD' : '#FF6B00'} />
        </View>
      </TouchableOpacity>
      {shouldShowRoute &&
        chains.map((chain, index) => (
          <View key={index} style={styles.mb8}>
            <SwapRouteItem chain={chain} baseInput={input} baseOutput={output} />
          </View>
        ))}
    </View>
  );
};
