import React, { FC, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  EvmTokenImagesStackParams,
  TezosTokenImagesStackParams,
  useEvmTokenImagesStack,
  useImagesStack,
  useTezosTokenImagesStack
} from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { isImageRectangular, isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { AssetIconPlaceholder } from '../asset-icon-placeholder';
import { CryptoLogo } from '../crypto-logo';
import { DataUriImage } from '../data-uri-image';

import { LoadableTokenIconImage } from './loadable-image';
import { TokenIconStyles } from './token-icon.styles';

interface CommonProps {
  iconName?: CryptoLogoNameEnum;
  isCollectible?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

interface TezosIconProps extends CommonProps, TezosTokenImagesStackParams {
  chainKind: TempleChainKind.Tezos;
}

interface EvmIconProps extends CommonProps, EvmTokenImagesStackParams {
  chainKind: TempleChainKind.EVM;
}

interface UnspecifiedIconProps extends CommonProps, TezosTokenImagesStackParams {
  chainKind?: undefined;
}

export type TokenIconProps = TezosIconProps | EvmIconProps | UnspecifiedIconProps;

type ImagesStackState = ReturnType<typeof useImagesStack>;
type TezosSourceStackHook = (params: TezosTokenImagesStackParams) => ImagesStackState;
type EvmSourceStackHook = (params: EvmTokenImagesStackParams) => ImagesStackState;

const TokenIconHOC = (
  useTezosSourceStack: TezosSourceStackHook,
  useEvmSourceStack: EvmSourceStackHook
): FC<TokenIconProps> => {
  const TezosTokenIcon: FC<TezosIconProps | UnspecifiedIconProps> = props => {
    const sourceStack = useTezosSourceStack(props);

    return <TokenIconView {...props} sourceStack={sourceStack} supportsRectangularImages />;
  };

  const EvmTokenIcon: FC<EvmIconProps> = props => {
    const sourceStack = useEvmSourceStack(props);

    return <TokenIconView {...props} sourceStack={sourceStack} />;
  };

  return props =>
    props.chainKind === TempleChainKind.EVM ? <EvmTokenIcon {...props} /> : <TezosTokenIcon {...props} />;
};

export const TokenIcon = TokenIconHOC(useTezosTokenImagesStack, useEvmTokenImagesStack);

interface TokenIconViewProps extends CommonProps {
  sourceStack: ImagesStackState;
  supportsRectangularImages?: boolean;
}

const TokenIconView: FC<TokenIconViewProps> = ({
  iconName,
  isCollectible = false,
  size = formatSize(32),
  sourceStack,
  style,
  supportsRectangularImages = false
}) => {
  const { src } = sourceStack;
  const borderRadius = useMemo(
    () => (isCollectible ? formatSize(8) : supportsRectangularImages && isImageRectangular(src) ? 0 : size / 2),
    [isCollectible, size, src, supportsRectangularImages]
  );
  const containerStyle = useMemo(() => ({ borderRadius, width: size, height: size }), [borderRadius, size]);

  return (
    <View style={[TokenIconStyles.container, containerStyle, style]}>
      <TokenIconImage
        {...sourceStack}
        borderRadius={borderRadius}
        iconName={iconName}
        isCollectible={isCollectible}
        size={size}
      />
    </View>
  );
};

interface TokenIconImageProps extends ImagesStackState {
  borderRadius: number;
  iconName?: CryptoLogoNameEnum;
  isCollectible: boolean;
  size: number;
}

const TokenIconImage: FC<TokenIconImageProps> = ({
  borderRadius,
  iconName,
  isCollectible,
  isLoading,
  isStackFailed,
  onFail,
  onSuccess,
  size,
  src
}) => {
  const isDataUri = useMemo(() => {
    const uri = src ?? '';

    return isImgUriDataUri(uri) || isSvgDataUriInBase64Encoding(uri);
  }, [src]);
  const imgSize = (size * 5) / 6;

  if (isDefined(iconName)) {
    return <CryptoLogo name={iconName} size={size} />;
  }

  if (src == null && !isLoading) {
    return <AssetIconPlaceholder isCollectible={isCollectible} size={size} />;
  }

  return isDataUri ? (
    <DataUriImage
      width={imgSize}
      height={imgSize}
      dataUri={src ?? ''}
      style={{ borderRadius }}
      onLoad={onSuccess}
      onError={onFail}
    />
  ) : (
    <LoadableTokenIconImage
      borderRadius={borderRadius}
      isCollectible={isCollectible}
      isLoading={isLoading}
      isStackFailed={isStackFailed}
      onError={onFail}
      onLoad={onSuccess}
      size={imgSize}
      uri={src}
    />
  );
};
