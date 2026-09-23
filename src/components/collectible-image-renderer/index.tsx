import FastImage from '@d11/react-native-fast-image';
import React, { memo, ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { ActivityIndicator } from '../activity-indicator';
import { BlurredImageFrame } from '../blurred-image-frame';

interface Props {
  background: ReactNode;
  dataUriForeground?: ReactNode;
  fallback: ReactNode;
  forceFrame?: boolean;
  frameStyle?: StyleProp<ViewStyle>;
  isFailed: boolean;
  isForegroundHidden?: boolean;
  isFullView: boolean;
  isLoading: boolean;
  onError: EmptyFn;
  onLoad: EmptyFn;
  overlay?: ReactNode;
  size: number;
  sourceUri?: string;
}

export const CollectibleImageRenderer = memo<Props>(
  ({
    background,
    dataUriForeground,
    fallback,
    forceFrame = false,
    frameStyle,
    isFailed,
    isForegroundHidden = false,
    isFullView,
    isLoading,
    onError,
    onLoad,
    overlay,
    size,
    sourceUri
  }) => {
    if (isFailed) {
      return fallback;
    }

    const foreground = dataUriForeground ?? (
      <FastImage
        style={styles.image}
        source={{ uri: sourceUri }}
        resizeMode="contain"
        onError={onError}
        onLoad={onLoad}
      />
    );

    if (dataUriForeground && !forceFrame) {
      return foreground;
    }

    return (
      <BlurredImageFrame
        size={size}
        style={frameStyle}
        background={background}
        foreground={foreground}
        isForegroundHidden={isForegroundHidden}
        overlay={
          <>
            {overlay}
            {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
          </>
        }
      />
    );
  }
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%'
  }
});
