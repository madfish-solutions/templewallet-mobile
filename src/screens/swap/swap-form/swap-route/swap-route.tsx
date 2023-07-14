import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { isSwapChains, Route3Chain } from 'src/interfaces/route3.interface';
import { useSwapParamsSelector } from 'src/store/swap/swap-selectors';

import { LbPoolPart } from '../lb-pool-part';
import { SwapRouteItem } from '../swap-route-item/swap-route-item';
import { SwapRouteSelectors } from './selectors';
import { useSwapRouteStyles } from './swap-route.styles';

interface Props {
  isLbOutput: boolean;
  isLbInput: boolean;
}

export const SwapRoute: FC<Props> = ({ isLbInput, isLbOutput }) => {
  const styles = useSwapRouteStyles();
  const [isRouteVisible, setIsVisible] = useState(false);
  const {
    data: { input, output, ...chains }
  } = useSwapParamsSelector();

  const chainsHeap = useMemo(() => {
    if (isSwapChains(chains)) {
      return chains.chains;
    }

    const { tzbtcChain, xtzChain } = chains;
    const tzbtcChains: Route3Chain[] =
      tzbtcChain.chains.length === 0
        ? [
            {
              input: tzbtcChain.input ?? '0',
              output: tzbtcChain.output ?? '0',
              hops: []
            }
          ]
        : tzbtcChain.chains;
    const xtzChains: Route3Chain[] =
      xtzChain.chains.length === 0
        ? [
            {
              input: xtzChain.input ?? '0',
              output: xtzChain.output ?? '0',
              hops: []
            }
          ]
        : xtzChain.chains;

    return tzbtcChains.concat(xtzChains);
  }, [chains]);

  const totalChains = chainsHeap.length;

  useEffect(() => {
    if (totalChains === 0) {
      setIsVisible(false);
    }
  }, [totalChains]);

  const totalHops =
    chainsHeap.reduce((accum, chain) => accum + chain.hops.length, 0) +
    ((isLbInput || isLbOutput) && chainsHeap.length > 0 ? 1 : 0);
  const shouldShowRoute = isRouteVisible && totalChains > 0;

  const iconName = isRouteVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown;

  const toggleRoutePress = () => setIsVisible(prevState => !prevState);

  return (
    <View>
      <TouchableWithAnalytics
        Component={TouchableOpacity}
        style={styles.title}
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
      </TouchableWithAnalytics>
      {shouldShowRoute && (
        <View style={styles.row}>
          {isLbInput && <LbPoolPart isLbOutput={false} amount={input} totalChains={totalChains} />}
          <View style={styles.flex}>
            {chainsHeap.map((chain, index) => (
              <View key={index} style={styles.mb8}>
                <SwapRouteItem
                  chain={chain}
                  baseInput={input}
                  baseOutput={output}
                  shouldShowInput={!isLbInput}
                  shouldShowOutput={!isLbOutput}
                />
              </View>
            ))}
          </View>
          {isLbOutput && <LbPoolPart isLbOutput amount={output} totalChains={totalChains} />}
        </View>
      )}
    </View>
  );
};
