import { noop } from 'lodash-es';
import React, { memo, useEffect, useMemo } from 'react';
import { StyleProp, FlexStyle, TransformsStyle, ShadowStyleIOS } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgCssUri } from 'react-native-svg';

import { ImageTypeEnum } from 'src/enums/image-type.enum';
import { useImageType } from 'src/hooks/use-image-type.hook';

import { DataUriImage } from './data-uri-image';

export interface UnknownTypeImageProps {
  width: number;
  height: number;
  uri: string;
  style?: StyleProp<FlexStyle & TransformsStyle & ShadowStyleIOS>;
  onLoad?: EmptyFn;
  onError?: EmptyFn;
}

export const UnknownTypeImage = memo<UnknownTypeImageProps>(({ width, height, uri, style, onLoad, onError = noop }) => {
  const { imageType, svgFailed, rasterFailed, onRasterRenderError, onSvgRenderError } = useImageType(uri);

  const sizeStyle = useMemo(() => ({ width, height }), [width, height]);

  useEffect(() => void (rasterFailed && svgFailed && onError()), [rasterFailed, svgFailed, onError]);

  switch (imageType) {
    case ImageTypeEnum.RemoteSvg:
      return (
        <SvgCssUri width={width} height={height} uri={uri} style={style} onLoad={onLoad} onError={onSvgRenderError} />
      );
    case ImageTypeEnum.DataUri:
      return (
        <DataUriImage width={width} height={height} dataUri={uri} style={style} onLoad={onLoad} onError={onError} />
      );
  }

  return <FastImage source={{ uri }} style={[style, sizeStyle]} onLoad={onLoad} onError={onRasterRenderError} />;
});
