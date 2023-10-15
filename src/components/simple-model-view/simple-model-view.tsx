import React, { memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { EmptyFn, emptyFn, EventFn } from 'src/config/general';

import { useSimpleModelViewStyles } from './simple-model-view.styles';

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
  </body>
</html>`;

interface SimpleModelViewProps {
  uri: string;
  isBinary: boolean;
  style?: StyleProp<ViewStyle>;
  onError?: EmptyFn;
  onLoadEnd?: EmptyFn;
  setScrollEnabled?: EventFn<boolean>;
}

export const SimpleModelView = memo<SimpleModelViewProps>(
  ({ uri, isBinary, style, onError = emptyFn, onLoadEnd = emptyFn, setScrollEnabled = emptyFn }) => {
    const styles = useSimpleModelViewStyles();
    const source = useMemo(() => {
      if (isBinary) {
        return { html: getHTML(uri) };
      }

      if (uri.includes('fxhash')) {
        return { uri };
      }

      return { uri: uri + '/index.html' };
    }, [uri]);

    const injectedJs = useMemo(
      () => `
        window.onerror = function(message) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
          return true;
        };
        true;
      `,
      []
    );

    const handleTouchStart = () => setScrollEnabled(false);
    const handleTouchEnd = () => setScrollEnabled(true);

    return (
      <WebView
        source={source}
        style={[styles.loverOpacity, style]}
        onError={onError}
        onMessage={onError}
        onLoadEnd={onLoadEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        injectedJavaScriptBeforeContentLoaded={injectedJs}
      />
    );
  }
);
