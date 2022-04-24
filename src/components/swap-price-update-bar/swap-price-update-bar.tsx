import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { BlockInterface, useAllRoutePairs } from 'swap-router-sdk';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { useSwapPriceUpdateBarStyles } from './swap-price-update-bar.styles';

interface Props {
}

export const BLOCK_DURATION = 30000;
export const TEZOS_DEXES_API_URL = 'wss://tezos-dexes-api-mainnet.production.madservice.xyz';

export const SwapPriceUpdateBar: FC<Props> = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const styles = useSwapPriceUpdateBarStyles();
  const [nowTimestamp, setNowTimestamp] = useState(new Date().getTime());

  const blockEndTimestamp = useMemo(
    () => new Date(allRoutePairs.block.header.timestamp).getTime() + BLOCK_DURATION,
    [allRoutePairs.block.header.timestamp]
  );

  const prevWidthPercentRef = useRef(0);

  const state = useMemo(() => {
    const millisecondsLeft = blockEndTimestamp - nowTimestamp;
    const secondsLeft = Math.floor(millisecondsLeft / 1000);
    const widthPercent = Math.max(0, Math.floor((100 / BLOCK_DURATION) * (millisecondsLeft - 1000)));
    const transitionTime = widthPercent < prevWidthPercentRef.current ? '1s' : '0s';
    prevWidthPercentRef.current = widthPercent;

    const text = isNaN(secondsLeft)
      ? 'Loading...'
      : secondsLeft >= 0
      ? `Rates update in ${secondsLeft}s`
      : `Rates update is late for ${Math.abs(secondsLeft)}s`;

    return {
      width: `${widthPercent}%`,
      transition: `${transitionTime} linear`,
      text
    };
  }, [blockEndTimestamp, nowTimestamp]);

  useEffect(() => {
    const interval = setInterval(() => setNowTimestamp(new Date().getTime()), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressBarAnimatedView, { width: state.width }]} />
      </View>
      <Divider size={formatSize(12)} />
      <Text style={styles.progressBarTextStyle}>{state.text}</Text>
    </View>
  );
};
