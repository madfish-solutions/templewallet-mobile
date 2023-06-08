import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isImgUriSvg, isImgUriDataUri, isImageRectangular, formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { DataUriImage } from '../data-uri-image';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { LoadableTokenIconImage } from './loadable-image';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TokenMetadataInterface, 'iconName' | 'thumbnailUri'> {
  size?: number;
  style?: ViewStyle;
}

export const TokenIcon: FC<Props> = ({ size = formatSize(32), thumbnailUri, style, ...rest }) => {
  const roundedStyle = useMemo(
    () => (isImageRectangular(thumbnailUri) ? undefined : { borderRadius: size / 2 }),
    [thumbnailUri]
  );

  return (
    <View style={[TokenIconStyles.container, roundedStyle, style]}>
      <TokenIconImage size={size} thumbnailUri={thumbnailUri} {...rest} />
    </View>
  );
};

type TokenIconImageProps = Props & {
  size: number;
};

const TokenIconImage: FC<TokenIconImageProps> = ({ iconName, thumbnailUri, size }) => {
  const isFromIpfs = thumbnailUri?.startsWith('ipfs') ?? false;
  const colors = useColors();
  const [forceSvg, setForceSvg] = useState(false);

  const { metadata } = useNetworkInfo();

  const handleLoadableTokenIconError = useCallback(() => {
    if (isFromIpfs) {
      setForceSvg(true);
    }
  }, [isFromIpfs]);

  useEffect(() => setForceSvg(false), [thumbnailUri]);

  if (isDefined(iconName)) {
    return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <Icon name={IconNameEnum.NoNameToken} size={size} />;
  }

  if (isImgUriSvg(thumbnailUri) || forceSvg) {
    const normalizedUri = isFromIpfs ? formatImgUri(thumbnailUri) : thumbnailUri;

    return <SvgCssUri width={size} height={size} uri={normalizedUri} />;
  }

  if (isImgUriDataUri(thumbnailUri)) {
    return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
  }

  return <LoadableTokenIconImage uri={thumbnailUri} size={size} onError={handleLoadableTokenIconError} />;
};
