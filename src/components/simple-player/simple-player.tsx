import React, { FC, useEffect, useState } from 'react';
import { AppState, ViewStyle } from 'react-native';
import Video, { LoadError } from 'react-native-video';

import { EmptyFn, EventFn, emptyFn } from 'src/config/general';

export interface SimpleVideoProps {
  uri: string;
  size: number;
  posterUri?: string;
  paused?: boolean;
  style?: ViewStyle;
  onError?: EventFn<LoadError>;
  onLoad?: EmptyFn;
}

const BUFFER_DURATION = 8000;

export const SimplePlayer: FC<SimpleVideoProps> = ({
  uri,
  posterUri,
  size,
  style,
  onError = emptyFn,
  onLoad = emptyFn
}) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active') {
        setPaused(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Video
      repeat
      source={{ uri }}
      // @ts-ignore
      style={[{ width: size, height: size }, style]}
      paused={paused}
      resizeMode="cover"
      bufferConfig={{
        bufferForPlaybackMs: BUFFER_DURATION
      }}
      poster={posterUri}
      posterResizeMode="cover"
      onError={onError}
      onLoad={onLoad}
    />
  );
};
