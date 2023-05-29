import React, { FC, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { emptyFn } from 'src/config/general';

const getHTML = (uri: string) =>
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Model Viewer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no"
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"></script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
      model-viewer {
        --progress-bar-color: orange;
        --progress-bar-height: 10px;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <model-viewer src="${JSON.stringify(uri)}" auto-rotate camera-controls autoplay shadow-intensity="1">
    </model-viewer>
  </body>
</html>`;

interface SimpleModelViewProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  onError?: () => void;
}

export const SimpleModelView: FC<SimpleModelViewProps> = ({ uri, style, onError = emptyFn }) => {
  const source = useMemo(() => ({ html: getHTML(uri) }), [uri]);

  return (
    <WebView
      originWhitelist={['*']}
      pointerEvents="none"
      scalesPageToFit
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      source={source}
      style={style}
      onError={onError}
    />
  );
};
