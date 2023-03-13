import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3SwapParamsResponse } from 'src/interfaces/route3.interface';

import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { useSwapRouteStyles } from './swap-route.styles';

interface Props {
  swapParams: Route3SwapParamsResponse;
}

export const SwapRoute: FC<Props> = ({ swapParams }) => {
  const styles = useSwapRouteStyles();
  const [isRouteVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (swapParams.chains.length === 0) {
      setIsVisible(false);
    }
  }, [swapParams.chains]);

  const totalChains = swapParams.chains.length;
  const totalHops = swapParams.chains.reduce((accum, chain) => accum + chain.hops.length, 0);
  const shouldShowRoute = isRouteVisible && swapParams.chains.length > 0;
  const iconName = isRouteVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown;

  const toggleRoutePress = () => setIsVisible(prevState => !prevState);

  return (
    <View>
      <TouchableOpacity
        style={[styles.flex, styles.row, styles.mb12]}
        onPress={toggleRoutePress}
        disabled={!Boolean(swapParams.output)}
      >
        <Text style={styles.infoText}>Swap route</Text>
        <View style={styles.row}>
          <Text style={styles.infoValue}>
            {totalChains} chains / {totalHops} dexes
          </Text>
          <Divider size={12} />
          <Icon name={iconName} color={!Boolean(swapParams.output) ? '#DDDDDD' : '#FF6B00'} />
        </View>
      </TouchableOpacity>
      {shouldShowRoute &&
        swapParams.chains.map((chain, index) => (
          <View key={index} style={styles.mb8}>
            <SwapRouteItem chain={chain} input={swapParams.input ?? 1} output={swapParams.output ?? 1} />
          </View>
        ))}
    </View>
  );
};
