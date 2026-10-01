import FastImage from '@d11/react-native-fast-image';
import React, { memo, ReactNode } from 'react';
import { Image, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// FastImage disables blur cache reuse on Android 12+. Use bitmap blur for the background.
const BackgroundImage = Platform.OS === 'android' ? Image : FastImage;

interface BlurredImageBackgroundProps {
  uri?: string;
  onError?: EmptyFn;
}

export const BlurredImageBackground = memo<BlurredImageBackgroundProps>(({ uri, onError }) => (
  <BackgroundImage
    style={styles.layer}
    source={uri ? { uri } : undefined}
    resizeMode="cover"
    blurRadius={16}
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
