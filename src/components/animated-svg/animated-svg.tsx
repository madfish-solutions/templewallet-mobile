import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { emptyFn } from 'src/config/general';
import { fixSvgXml, getXmlFromSvgDataUriInUtf8Encoding } from 'src/utils/image.utils';

const getHTML = (svgContent: string) =>
  `
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="utf-8">
  <title>Animated Svg</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no">
  <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: transparent;
      }
      svg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        user-select: none;
      }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>`;

interface AnimatedSvgProps {
  dataUri: string;
  style?: ViewStyle;
  onError?: () => void;
  onLoadEnd?: () => void;
}

export const AnimatedSvg: FC<AnimatedSvgProps> = ({ dataUri, style, onError = emptyFn, onLoadEnd = emptyFn }) => {
  const source = useMemo(() => ({ html: getHTML(fixSvgXml(getXmlFromSvgDataUriInUtf8Encoding(dataUri))) }), [dataUri]);

  return <WebView source={source} style={style} onError={onError} onLoadEnd={onLoadEnd} />;
};
