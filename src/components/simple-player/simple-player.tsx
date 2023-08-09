import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import Video, { LoadError } from 'react-native-video';

import { EmptyFn, EventFn, emptyFn } from 'src/config/general';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useAppLock } from 'src/shelter/app-lock/app-lock';

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
  paused = true,
  size,
  style,
  onError = emptyFn,
  onLoad = emptyFn
}) => {
  const atBootsplash = useAtBootsplash();
  const { isLocked } = useAppLock();

  return (
    <Video
      repeat
      source={{ uri }}
      // @ts-ignore
      style={[{ width: size, height: size }, style]}
      paused={atBootsplash || isLocked || paused}
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
