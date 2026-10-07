import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import { useWillUnmount } from 'src/utils/hooks/use-will-unmount';

import { ActivityIndicator } from '../activity-indicator';
import { BrokenImage } from '../broken-image';

import { useSimpleModelViewStyles } from './styles';

interface Props {
  uri: string;
  isBinary: boolean;
  style?: StyleProp<ViewStyle>;
  onFail?: EmptyFn;
  setScrollEnabled?: SyncFn<boolean>;
}

const MODEL_LOAD_ERROR_MESSAGE = 'model-load-error';

export const SimpleModelView = memo<Props>(({ uri, isBinary, style, onFail, setScrollEnabled }) => {
  const styles = useSimpleModelViewStyles();

  const source = useMemo(() => (isBinary ? { html: getHTML(uri) } : { uri }), [isBinary, uri]);

  const [isLoading, setIsLoading] = useState(false);
  const [shouldUseFallback, setShouldUseFallback] = useState(false);

  useWillUnmount(() => setScrollEnabled?.(true));

  const handleTouchStart = () => setScrollEnabled?.(false);
  const handleTouchEnd = () => setScrollEnabled?.(true);

  useEffect(() => setShouldUseFallback(false), [uri]);

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const { data } = event.nativeEvent;

      if (data === MODEL_LOAD_ERROR_MESSAGE) {
        onFail?.();

        return;
      }

      if (data.startsWith('"Uncaught')) {
        setShouldUseFallback(true);
      }
      console.error('WebView embeded page error:', data);
    },
    [onFail]
  );

  const handleHttpError = useCallback(
    (event: WebViewHttpErrorEvent) => {
      if (event.nativeEvent.url === uri) {
        onFail?.();
      }
    },
    [onFail, uri]
  );

  return (
    <>
      {shouldUseFallback ? (
        <BrokenImage isBigIcon style={[styles.lowerOpacity, style]} />
      ) : (
        <WebView
          source={source}
          style={[styles.lowerOpacity, style]}
          onError={onFail}
          onHttpError={handleHttpError}
          onMessage={handleWebViewMessage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
        />
      )}

      {isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
});

const getHTML = (uri: string) =>
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Model Viewer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no">
    <script type="module" src="https://unpkg.com/@google/model-viewer@1.2.0/dist/model-viewer.js"></script>
    <script nomodule src="https://unpkg.com/@google/model-viewer@1.2.0/dist/model-viewer-legacy.js"></script>
    <style>
      * { margin:0; padding:0; }
      html, body { height: 100%; width: 100%; }
      model-viewer { width: 100%; height: 100%;}
    </style>
  </head>
  <body>
    <model-viewer src=${JSON.stringify(uri)} auto-rotate camera-controls autoplay shadow-intensity="1">
    </model-viewer>
    <script>
      document.querySelector('model-viewer').addEventListener('error', function (event) {
        if (!event.detail || event.detail.type !== 'webglcontextlost') {
          window.ReactNativeWebView.postMessage(${JSON.stringify(MODEL_LOAD_ERROR_MESSAGE)});
        }
      });
    </script>
  </body>
</html>`;

/**
 * Some media throws error, while still renders correctly.
 * See: `KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_60667`
 */
const injectedJavaScriptBeforeContentLoaded = `
  window.onerror = function(message) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
    return true;
  };
  true;
`;
