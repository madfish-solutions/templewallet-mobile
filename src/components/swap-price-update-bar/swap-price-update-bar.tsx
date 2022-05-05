import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { useSwapPriceUpdateBarStyles } from './swap-price-update-bar.styles';

export const BLOCK_DURATION = 30000;

export const SwapPriceUpdateBar: FC<{ timestamp?: string }> = ({ timestamp = 0 }) => {
  const counter = useRef(new Animated.Value(0)).current;
  const styles = useSwapPriceUpdateBarStyles();
  const [nowTimestamp, setNowTimestamp] = useState(new Date().getTime());

  const blockEndTimestamp = useMemo(() => new Date(timestamp).getTime() + BLOCK_DURATION, [timestamp]);

  const state = useMemo(() => {
    const millisecondsLeft = blockEndTimestamp - nowTimestamp;
    const secondsLeft = Math.floor(millisecondsLeft / 1000);

    const text = isNaN(secondsLeft)
      ? 'Loading...'
      : secondsLeft >= 0
      ? `Rates update in ${secondsLeft}s`
      : `Rates update is late for ${Math.abs(secondsLeft)}s`;

    return {
      text
    };
  }, [blockEndTimestamp, nowTimestamp]);

  useEffect(() => {
    load(nowTimestamp);
  }, [nowTimestamp]);

  const load = (nowTimestamp: number) => {
    const widthPercent = Math.max(0, blockEndTimestamp - nowTimestamp) / BLOCK_DURATION;
    if (isNaN(blockEndTimestamp)) {
      return 0;
    }
    Animated.timing(counter, {
      toValue: widthPercent,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  const width = counter.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    const interval = setInterval(() => setNowTimestamp(new Date().getTime()), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressBarAnimatedView, { transform: [{ scaleX: width }] }]} />
      </View>
      <Divider size={formatSize(6)} />
      <Text style={styles.progressBarTextStyle}>{state.text}</Text>
    </View>
  );
};
