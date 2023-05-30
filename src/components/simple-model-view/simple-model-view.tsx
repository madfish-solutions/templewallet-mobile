import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { emptyFn } from 'src/config/general';

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
  style?: ViewStyle;
  onError?: () => void;
  onLoadEnd?: () => void;
  setScrollEnabled?: (value: boolean) => void;
}

export const SimpleModelView: FC<SimpleModelViewProps> = ({
  uri,
  style,
  onError = emptyFn,
  onLoadEnd = emptyFn,
  setScrollEnabled = emptyFn
}) => {
  const styles = useSimpleModelViewStyles();
  const source = useMemo(() => ({ html: getHTML(uri) }), [uri]);

  const handleTouchStart = () => setScrollEnabled(false);
  const handleTouchEnd = () => setScrollEnabled(true);

  return (
    <WebView
      source={source}
      style={[styles.loverOpacity, style]}
      onError={onError}
      onLoadEnd={onLoadEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    />
  );
};