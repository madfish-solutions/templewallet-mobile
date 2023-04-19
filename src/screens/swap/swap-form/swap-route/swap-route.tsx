import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useSwapParamsSelector } from 'src/store/swap/swap-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { SwapRouteSelectors } from './selectors';
import { useSwapRouteStyles } from './swap-route.styles';

export const SwapRoute: FC = () => {
  const styles = useSwapRouteStyles();
  const [isRouteVisible, setIsVisible] = useState(false);
  const {
    data: { chains, input, output }
  } = useSwapParamsSelector();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (chains.length === 0) {
      setIsVisible(false);
    }
  }, [chains]);

  const totalChains = chains.length;
  const totalHops = chains.reduce((accum, chain) => accum + chain.hops.length, 0);
  const shouldShowRoute = isRouteVisible && chains.length > 0;

  const iconName = isRouteVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown;

  const toggleRoutePress = () => {
    trackEvent(SwapRouteSelectors.showRouteSwitcher, AnalyticsEventCategory.ButtonPress);
    setIsVisible(prevState => !prevState);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.flex, styles.row, styles.mb12]}
        onPress={toggleRoutePress}
        disabled={!Boolean(output)}
        testID={SwapRouteSelectors.showRouteSwitcher}
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
