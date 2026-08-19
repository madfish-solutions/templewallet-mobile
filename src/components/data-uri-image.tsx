import React, { FC, memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgWithCss } from 'react-native-svg/css';
import { WebView } from 'react-native-webview';

import {
  fixSvgXml,
  getXmlFromSvgDataUriInUtf8Encoding,
  isImgUriDataUri,
  isSvgDataUriInBase64Encoding
} from 'src/utils/image.utils';

interface Props extends Omit<AnimatedDataUriImageProps, 'xml'> {
  dataUri: string;
  animated?: boolean;
  width: number;
  height: number;
}

export const DataUriImage = memo<Props>(({ dataUri, animated, width, height, style, onLoad, onError }) => {
  const isBase64Encoded = isSvgDataUriInBase64Encoding(dataUri);

  if (!isImgUriDataUri(dataUri) && !isBase64Encoded) {
    throw new Error('URI format is unknown');
  }

  const xml = useMemo(
    () =>
      fixSvgXml(
        isBase64Encoded
          ? Buffer.from(dataUri.split(',')[1], 'base64').toString('utf8')
          : getXmlFromSvgDataUriInUtf8Encoding(dataUri)
      ),
    [dataUri, isBase64Encoded]
  );

  return animated || xml.includes('<foreignObject') ? (
    <AnimatedDataUriImage xml={xml} width={width} height={height} style={style} onLoad={onLoad} onError={onError} />
  ) : (
    <SvgWithCss xml={xml} width={width} height={height} style={style} onLoad={onLoad} onError={onError} />
  );
});

interface AnimatedDataUriImageProps {
  xml: string;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  onLoad?: EmptyFn;
  onError?: EmptyFn;
}

const AnimatedDataUriImage: FC<AnimatedDataUriImageProps> = ({ xml, width, height, style, onLoad, onError }) => (
  <WebView
    source={{ html: buildWebViewHTML(xml) }}
    style={[style, { width, height }]}
    onLoadEnd={onLoad}
    onError={onError}
  />
);

const buildWebViewHTML = (svgContent: string) =>
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
