import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LoadError, OnLoadData as NativeOnLoadData } from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import WebView from 'react-native-webview';

import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useAppLock } from 'src/shelter/app-lock/app-lock';

import { ActivityIndicator } from '../activity-indicator';

interface Props {
  uri: string;
  size: number;
  style?: StyleProp<ViewStyle>;
  withLoader?: boolean;
  onError?: SyncFn<LoadError>;
  isVideo?: boolean;
}

const BUFFER_DURATION = 8000;

export const SimplePlayer = memo<Props>(({ uri, size, style, withLoader, onError, isVideo = false }) => {
  const atBootsplash = useAtBootsplash();
  const { isLocked } = useAppLock();

  const [shouldUseNativePlayer, setShouldUseNativePlayer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [appIsActive, setAppIsActive] = useState(true);

  const onAppActiveState = useCallback(() => setAppIsActive(true), []);
  const onAppOtherState = useCallback(() => setAppIsActive(false), []);
  useAppStateStatus({ onAppActiveState, onAppInactiveState: onAppOtherState, onAppBackgroundState: onAppOtherState });

  useEffect(() => setShouldUseNativePlayer(true), [uri]);

  const handleNativePlayerLoad = useCallback(
    (data: NativeOnLoadData) => {
      const { width, height } = data.naturalSize;

      if (width === 0 && height === 0 && isVideo) {
        setShouldUseNativePlayer(false);
      } else {
        setIsLoading(false);
      }
    },
    [isVideo]
  );

  const nativePlayerLoadStart = useCallback(() => setIsLoading(true), []);
  const handleWebViewLoad = useCallback(() => setIsLoading(false), []);

  const handleWebViewError = useCallback(() => {
    if (onError) {
      onError({ error: { '': '', errorString: 'Failed to load video, it may be invalid or unsupported' } });
    }
  }, [onError]);

  return (
    <>
      {shouldUseNativePlayer ? (
        <VideoPlayer
          repeat
          source={{ uri }}
          style={[{ width: size, height: size }, style]}
          paused={atBootsplash || isLocked || !appIsActive}
          resizeMode="cover"
          ignoreSilentSwitch="ignore"
          bufferConfig={{
            bufferForPlaybackMs: BUFFER_DURATION
          }}
          onError={onError}
          onLoadStart={nativePlayerLoadStart}
          onLoad={handleNativePlayerLoad}
          disableFullscreen
          disableBack
        />
      ) : (
        <WebView
          source={{ uri }}
          style={[{ width: size, height: size }, style]}
          onError={handleWebViewError}
          onLoadEnd={handleWebViewLoad}
        />
      )}

      {withLoader && isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
});
