import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SvgCssUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { addKnownSvg, removeKnownSvg } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useIsKnownSvgSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
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
  style?: StyleProp<ViewStyle>;
}

export const TokenIcon: FC<Props> = ({ size = formatSize(32), thumbnailUri, style, ...rest }) => {
  const roundedStyle = useMemo(
    () => (isImageRectangular(thumbnailUri) ? undefined : { borderRadius: size / 2 }),
    [thumbnailUri]
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

const ENDS_WITH_EXTENSION_REGEX = /\.[a-z0-9]+$/i;

const TokenIconImage: FC<TokenIconImageProps> = ({ iconName, thumbnailUri, size }) => {
  const mayBeUnknownSvg = !ENDS_WITH_EXTENSION_REGEX.test(thumbnailUri ?? '');
  const colors = useColors();
  const dispatch = useDispatch();
  const isKnownSvg = useIsKnownSvgSelector(thumbnailUri ?? '');
  const [svgFailed, setSvgFailed] = useState(false);

  const { metadata } = useNetworkInfo();

  const handleLoadableTokenIconError = useCallback(() => {
    if (mayBeUnknownSvg && !svgFailed) {
      dispatch(addKnownSvg(thumbnailUri ?? ''));
    }
  }, [mayBeUnknownSvg, thumbnailUri, svgFailed, dispatch]);

  const handleSvgError = useCallback(() => {
    if (mayBeUnknownSvg) {
      setSvgFailed(true);
      dispatch(removeKnownSvg(thumbnailUri ?? ''));
    }
  }, [thumbnailUri, mayBeUnknownSvg, dispatch]);

  useEffect(() => setSvgFailed(false), [thumbnailUri]);

  if (isDefined(iconName)) {
    return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
  }

  if (!isString(thumbnailUri)) {
    return <Icon name={IconNameEnum.NoNameToken} size={size} />;
  }

  if (isImgUriSvg(thumbnailUri) || (isKnownSvg && !svgFailed)) {
    return <SvgCssUri width={size} height={size} uri={formatImgUri(thumbnailUri)} onError={handleSvgError} />;
  }

  if (isImgUriDataUri(thumbnailUri)) {
    return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
  }

  return (
    <LoadableTokenIconImage
      uri={thumbnailUri}
      size={size}
      onError={handleLoadableTokenIconError}
      useOriginal={svgFailed}
    />
  );
};
