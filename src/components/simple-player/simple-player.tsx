import React, { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Video, { LoadError } from 'react-native-video';

import { EventFn, emptyFn } from 'src/config/general';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useAppLock } from 'src/shelter/app-lock/app-lock';

interface SimpleVideoProps {
  uri: string;
  size: number;
  posterUri?: string;
  style?: StyleProp<ViewStyle>;
  onError?: EventFn<LoadError>;
  onLoad?: EmptyFn;
}

const BUFFER_DURATION = 8000;

export const SimplePlayer = memo<SimpleVideoProps>(
  ({ uri, posterUri, size, style, onError = emptyFn, onLoad = emptyFn }) => {
    const atBootsplash = useAtBootsplash();
    const { isLocked } = useAppLock();

    return (
      <Video
        repeat
        source={{ uri }}
        style={[{ width: size, height: size }, style]}
        paused={atBootsplash || isLocked}
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
  }
);
