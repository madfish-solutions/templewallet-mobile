import React, { FC, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { useSwapPriceUpdateBarStyles } from './swap-price-update-bar.styles';

export const BLOCK_DURATION = 30000;

interface Props {
  nowTimestamp: number;
  blockEndTimestamp: number;
}

export const SwapPriceUpdateBar: FC<Props> = ({ nowTimestamp, blockEndTimestamp }) => {
  const counter = useRef(new Animated.Value(0)).current;
  const styles = useSwapPriceUpdateBarStyles();

  useEffect(() => {
    const widthPercent = Math.max(0, blockEndTimestamp - nowTimestamp) / BLOCK_DURATION;

    if (isNaN(blockEndTimestamp)) {
      return;
    }

    Animated.timing(counter, {
      toValue: widthPercent,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, [nowTimestamp]);

  const width = counter.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressBarAnimatedView, { transform: [{ scaleX: width }] }]} />
      </View>
    </View>
  );
};
