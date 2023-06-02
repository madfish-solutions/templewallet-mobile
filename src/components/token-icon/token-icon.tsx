import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { addKnownIpfsSvg, removeKnownIpfsSvg } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useIsKnownIpfsSvgSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { formatSizeScaled } from 'src/styles/format-size';
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
}

export const TokenIcon: FC<Props> = ({ size = formatSizeScaled(32), thumbnailUri, ...rest }) => {
  const roundedStyle = useMemo(
    () => (isImageRectangular(thumbnailUri) ? undefined : { borderRadius: size / 2 }),
    [thumbnailUri]
  );
  const containerSizeStyle = useMemo(() => ({ width: size, height: size }), [size]);

  return (
    <View style={[TokenIconStyles.container, roundedStyle, containerSizeStyle]}>
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
  const dispatch = useDispatch();
  const forceSvg = useIsKnownIpfsSvgSelector(thumbnailUri ?? '');
  const [triedSvg, setTriedSvg] = useState(false);

  const { metadata } = useNetworkInfo();

  const handleLoadableTokenIconError = useCallback(() => {
    if (isFromIpfs && !triedSvg) {
      dispatch(addKnownIpfsSvg(thumbnailUri!));
    }
  }, [isFromIpfs, thumbnailUri, triedSvg, dispatch]);

  const handleSvgError = useCallback(() => {
    if (isFromIpfs) {
      setTriedSvg(true);
      dispatch(removeKnownIpfsSvg(thumbnailUri!));
    }
  }, [thumbnailUri, isFromIpfs, dispatch]);

  useEffect(() => setTriedSvg(false), [thumbnailUri]);

  if (isDefined(iconName)) {
    return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <Icon name={IconNameEnum.NoNameToken} size={size} />;
  }

  if (isImgUriSvg(thumbnailUri) || forceSvg) {
    const normalizedUri = isFromIpfs ? formatImgUri(thumbnailUri) : thumbnailUri;

    return <SvgCssUri width={size} height={size} uri={normalizedUri} onError={handleSvgError} />;
  }

  if (isImgUriDataUri(thumbnailUri)) {
    return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
  }

  return <LoadableTokenIconImage uri={thumbnailUri} size={size} onError={handleLoadableTokenIconError} />;
};
