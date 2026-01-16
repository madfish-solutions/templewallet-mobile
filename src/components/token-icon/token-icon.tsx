import React, { FC, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';

import { ImageTypeEnum } from 'src/enums/image-type.enum';
import { useImageType } from 'src/hooks/use-image-type.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isImageRectangular, formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { DataUriImage } from '../data-uri-image';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { LoadableTokenIconImage } from './loadable-image';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TokenMetadataInterface, 'iconName' | 'thumbnailUri'> {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const TokenIcon: FC<Props> = ({ size = formatSize(32), thumbnailUri, style, ...rest }) => {
  const roundedStyle = useMemo(
    () => (isImageRectangular(thumbnailUri) ? undefined : { borderRadius: size / 2 }),
    [size, thumbnailUri]
  );
  const containerSizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  return (
    <View style={[TokenIconStyles.container, roundedStyle, containerSizeStyle, style]}>
      <TokenIconImage size={size} thumbnailUri={thumbnailUri} {...rest} />
    </View>
  );
};

type TokenIconImageProps = Props & {
  size: number;
};

const TokenIconImage: FC<TokenIconImageProps> = ({ iconName, thumbnailUri, size }) => {
  const { imageType, svgFailed, onRasterRenderError, onSvgRenderError } = useImageType(thumbnailUri ?? '');

  const colors = useColors();

  const { metadata } = useNetworkInfo();

  if (isDefined(iconName)) {
    return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <Icon name={IconNameEnum.NoNameToken} size={size} />;
  }

  switch (imageType) {
    case ImageTypeEnum.RemoteSvg:
      return <SvgCssUri width={size} height={size} uri={formatImgUri(thumbnailUri)!} onError={onSvgRenderError} />;
    case ImageTypeEnum.DataUri:
      return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
  }

  return (
    <LoadableTokenIconImage uri={thumbnailUri} size={size} onError={onRasterRenderError} useOriginal={svgFailed} />
  );
};
