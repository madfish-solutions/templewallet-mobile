import React, { FC, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { isImageRectangular, isImgUriDataUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { CryptoLogo } from '../crypto-logo';
import { CryptoLogoNameEnum } from '../crypto-logo/logo-name.enum';
import { DataUriImage } from '../data-uri-image';

import { LoadableTokenIconImage } from './loadable-image';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TezosTokenMetadata, 'iconName' | 'thumbnailUri'> {
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
  const isDataUri = useMemo(() => isImgUriDataUri(thumbnailUri ?? ''), [thumbnailUri]);

  if (isDefined(iconName)) {
    return <CryptoLogo name={iconName} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <CryptoLogo name={CryptoLogoNameEnum.Placeholder} size={size} />;
  }

  const imgSize = (size * 5) / 6;

  return isDataUri ? (
    <DataUriImage width={imgSize} height={imgSize} dataUri={thumbnailUri} />
  ) : (
    <LoadableTokenIconImage uri={thumbnailUri} size={imgSize} />
  );
};
