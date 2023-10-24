import React, { memo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Video, { LoadError } from 'react-native-video';

import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useAppLock } from 'src/shelter/app-lock/app-lock';

import { ActivityIndicator } from '../activity-indicator';

interface Props {
  uri: string;
  size: number;
  style?: StyleProp<ViewStyle>;
  withLoader?: boolean;
  onError?: SyncFn<LoadError>;
}

const BUFFER_DURATION = 8000;

export const SimplePlayer = memo<Props>(({ uri, size, style, withLoader, onError }) => {
  const atBootsplash = useAtBootsplash();
  const { isLocked } = useAppLock();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Video
        repeat
        source={{ uri }}
        style={[{ width: size, height: size }, style]}
        paused={atBootsplash || isLocked}
        resizeMode="cover"
        bufferConfig={{
          bufferForPlaybackMs: BUFFER_DURATION
        }}
        onError={onError}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />

      {withLoader && isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
});
