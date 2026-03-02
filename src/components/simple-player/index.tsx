import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { OnLoadData as NativeOnLoadData, OnVideoErrorData } from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { WebView } from 'react-native-webview';

import { emptyFn } from 'src/config/general';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { ActivityIndicator } from '../activity-indicator';

interface Props {
  uri: string;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  onError?: SyncFn<OnVideoErrorData>;
  onLoad?: EmptyFn;
  isVideo?: boolean;
  shouldShowLoader?: boolean;
}

const BUFFER_DURATION = 8000;

export const SimplePlayer = memo<Props>(
  ({ uri, width, height, style, onError = emptyFn, onLoad = emptyFn, isVideo = false, shouldShowLoader = true }) => {
    const atBootsplash = useAtBootsplash();
    const { isLocked } = useAppLock();
    const { trackErrorEvent } = useAnalytics();

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
          onLoad();
        }
      },
      [isVideo, onLoad]
    );

    const nativePlayerLoadStart = useCallback(() => setIsLoading(true), []);
    const handleWebViewLoad = useCallback(() => {
      onLoad();
      setIsLoading(false);
    }, [onLoad]);

    const handleWebViewError = useCallback(() => {
      onError({ error: { errorString: 'Failed to load video, it may be invalid or unsupported' } });
    }, [onError]);

    const handleNativePlayerError = useCallback(
      (error: unknown) => {
        trackErrorEvent('NativePlayerError', error, [], { uri });
        setShouldUseNativePlayer(false);
      },
      [trackErrorEvent, uri]
    );

    return (
      <>
        {shouldUseNativePlayer ? (
          <VideoPlayer
            repeat
            source={{ uri }}
            style={[{ width, height }, style]}
            paused={atBootsplash || isLocked || !appIsActive}
            resizeMode="contain"
            ignoreSilentSwitch="ignore"
            bufferConfig={{
              bufferForPlaybackMs: BUFFER_DURATION,
              bufferForPlaybackAfterRebufferMs: BUFFER_DURATION * 2
            }}
            onError={handleNativePlayerError}
            onLoadStart={nativePlayerLoadStart}
            onLoad={handleNativePlayerLoad}
            disableFullscreen
            disableBack
            disableVolume
            videoStyle={isVideo ? undefined : styles.audio}
          />
        ) : (
          <WebView
            source={{ uri }}
            style={[{ width, height }, style]}
            onError={handleWebViewError}
            onLoadEnd={handleWebViewLoad}
          />
        )}

        {isLoading && !shouldUseNativePlayer && shouldShowLoader ? <ActivityIndicator size="large" /> : null}
      </>
    );
  }
);

const styles = StyleSheet.create({
  audio: {
    opacity: 0
  }
});
