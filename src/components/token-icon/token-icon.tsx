import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSizeScaled } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isImgUriSvg, isImgUriDataUri, isImageRectangular } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { DataUriImage } from '../data-uri-image/data-uri-image';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { LoadableTokenIconImage } from './loadable-image';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TokenMetadataInterface, 'iconName' | 'thumbnailUri'> {
  size?: number;
}

export const TokenIcon: FC<Props> = ({ size = formatSizeScaled(32), thumbnailUri, ...rest }) => {
  const roundedStyle = useMemo(
    () => (isImageRectangular(thumbnailUri) ? undefined : { borderRadius: size / 2 }),
    [thumbnailUri]
  );

  return (
    <View style={[TokenIconStyles.container, roundedStyle]}>
      <TokenIconImage size={size} thumbnailUri={thumbnailUri} {...rest} />
    </View>
  );
};

type TokenIconImageProps = Props & {
  size: number;
};

const TokenIconImage: FC<TokenIconImageProps> = ({ iconName, thumbnailUri, size }) => {
  const colors = useColors();

  const { metadata } = useNetworkInfo();

  if (isDefined(iconName)) {
    return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <Icon name={IconNameEnum.NoNameToken} size={size} />;
  }

  if (isImgUriSvg(thumbnailUri)) {
    return <SvgCssUri width={size} height={size} uri={thumbnailUri} />;
  }

  if (isImgUriDataUri(thumbnailUri)) {
    return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
  }

  return <LoadableTokenIconImage uri={thumbnailUri} size={size} />;
};
