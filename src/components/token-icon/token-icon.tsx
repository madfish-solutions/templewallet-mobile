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
import { NftFallbackIcon } from './nft-fallback-icon';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TezosTokenMetadata, 'iconName' | 'thumbnailUri'> {
  isCollectible?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const TokenIcon: FC<Props> = ({
  isCollectible = false,
  size = formatSize(32),
  thumbnailUri,
  style,
  ...rest
}) => {
  const roundedStyle = useMemo(
    () => ({ borderRadius: isCollectible ? formatSize(8) : isImageRectangular(thumbnailUri) ? 0 : size / 2 }),
    [isCollectible, size, thumbnailUri]
  );
  const containerSizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  return (
    <View style={[TokenIconStyles.container, roundedStyle, containerSizeStyle, style]}>
      <TokenIconImage
        size={size}
        thumbnailUri={thumbnailUri}
        borderRadius={roundedStyle.borderRadius}
        isCollectible={isCollectible}
        {...rest}
      />
    </View>
  );
};

type TokenIconImageProps = Props & {
  borderRadius: number;
  size: number;
};

const TokenIconImage: FC<TokenIconImageProps> = ({ borderRadius, iconName, isCollectible, thumbnailUri, size }) => {
  const isDataUri = useMemo(() => isImgUriDataUri(thumbnailUri ?? ''), [thumbnailUri]);
  const imgSize = (size * 5) / 6;

  if (isDefined(iconName)) {
    return <CryptoLogo name={iconName} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    if (isCollectible) {
      return <NftFallbackIcon borderRadius={borderRadius} size={imgSize} />;
    }

    return <CryptoLogo name={CryptoLogoNameEnum.Placeholder} size={size} />;
  }

  return isDataUri ? (
    <DataUriImage width={imgSize} height={imgSize} dataUri={thumbnailUri} style={{ borderRadius }} />
  ) : (
    <LoadableTokenIconImage
      uri={thumbnailUri}
      size={imgSize}
      borderRadius={borderRadius}
      isCollectible={isCollectible}
    />
  );
};
