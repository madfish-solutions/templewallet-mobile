import React, { memo, ReactNode } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// FastImage applies blurRadius on the main thread, creating a CIContext per image.
// React Native Image blurs off the main thread.

interface BlurredImageBackgroundProps {
  uri?: string;
  onError?: EmptyFn;
  onLoad?: EmptyFn;
}

export const BlurredImageBackground = memo<BlurredImageBackgroundProps>(({ uri, onError, onLoad }) => (
  <Image
    style={styles.layer}
    source={uri ? { uri } : undefined}
    resizeMode="cover"
    blurRadius={16}
    onError={onError}
    onLoad={onLoad}
  />
));

interface BlurredImageFrameProps {
  size: number;
  background: ReactNode;
  foreground: ReactNode;
  overlay?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BlurredImageFrame = memo<BlurredImageFrameProps>(({ size, background, foreground, overlay, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    {background}
    {foreground != null && (
      <View pointerEvents="none" style={styles.layer}>
        {foreground}
      </View>
    )}
    {overlay}
  </View>
));

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  layer: {
    ...StyleSheet.absoluteFill
  }
});
