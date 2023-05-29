import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { emptyFn } from 'src/config/general';

const getHTML = (uri: string) =>
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Model Viewer</title>
    <script type="module" src="https://unpkg.com/@google/model-viewer@1.2.0/dist/model-viewer.js"></script>
    <script nomodule src="https://unpkg.com/@google/model-viewer@1.2.0/dist/model-viewer-legacy.js"></script>
    <style>
      * { margin:0; padding:0; }
      html, body { height: 100%; width: 100%; }
      model-viewer {
        --progress-bar-color: orange;
        --progress-bar-height: 10px;
        width: 100%;
        height: 100%;
      }
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
}

export const SimpleModelView: FC<SimpleModelViewProps> = ({ uri, style, onError = emptyFn }) => {
  const source = useMemo(() => ({ html: getHTML(uri) }), [uri]);

  return <WebView originWhitelist={['*']} source={source} style={style} onError={onError} />;
};
