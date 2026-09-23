import FastImage from '@d11/react-native-fast-image';
import React, { memo, ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const BLUR_RADIUS = Platform.select({ android: 42, default: 16 });

interface BlurredImageBackgroundProps {
  uri?: string;
  onError?: EmptyFn;
}

export const BlurredImageBackground = memo<BlurredImageBackgroundProps>(({ uri, onError }) => (
  <FastImage
    style={styles.layer}
    source={uri ? { uri } : undefined}
    resizeMode="cover"
    blurRadius={BLUR_RADIUS}
    onError={onError}
  />
));

interface BlurredImageFrameProps {
  size: number;
  background: ReactNode;
  foreground: ReactNode;
  overlay?: ReactNode;
  isForegroundHidden?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const BlurredImageFrame = memo<BlurredImageFrameProps>(
  ({ size, background, foreground, overlay, isForegroundHidden = false, style }) => (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {background}
      <View pointerEvents="none" style={[styles.layer, isForegroundHidden && styles.hidden]}>
        {foreground}
      </View>
      {overlay}
    </View>
  )
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  layer: {
    ...StyleSheet.absoluteFill
  },
  hidden: {
    opacity: 0
  }
});
