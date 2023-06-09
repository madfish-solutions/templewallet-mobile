import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import Video from 'react-native-video';

import { EmptyFn, emptyFn } from 'src/config/general';

interface SimpleVideoProps {
  uri: string;
  size: number;
  posterUri?: string;
  style?: ViewStyle;
  onError?: EmptyFn;
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
  return (
    <Video
      repeat
      source={{ uri }}
      // @ts-ignore
      style={[{ width: size, height: size }, style]}
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
