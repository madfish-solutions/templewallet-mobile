import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { DataUriImage } from 'src/components/data-uri-image';
import { IconV2 } from 'src/components/icon-v2';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { useColors } from 'src/styles/use-colors';
import { buildEvmCollectibleImagesStack, isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import {
  ACTIVITY_ASSET_BADGE_LOGO_SIZE,
  ACTIVITY_ASSET_IMAGE_SIZE,
  ACTIVITY_ASSET_NFT_BORDER_RADIUS,
  ACTIVITY_ASSET_STACK_FACE_NFT_BORDER_RADIUS,
  ACTIVITY_ASSET_STACK_NFT_FACE_SIZE,
  ACTIVITY_ASSET_STACK_TOKEN_FACE_SIZE,
  useActivityAssetImageStyles
} from './activity-asset-image.styles';
import { ActivityAssetImageKind, ActivityAssetImageSource, ActivityRowKind } from './types';
import { getActivityRowIconName } from './utils';

interface FaceProps {
  source?: ActivityAssetImageSource;
  kind: ActivityRowKind;
  isNft?: boolean;
  withoutAssetIcon?: boolean;
  size: number;
  borderRadius: number;
}

const EvmCollectibleFace = memo<{ imageUri?: string; size: number; borderRadius: number }>(
  ({ imageUri, size, borderRadius }) => {
    const styles = useActivityAssetImageStyles();
    const sourcesStack = useMemo(() => buildEvmCollectibleImagesStack(imageUri), [imageUri]);
    const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sourcesStack);

    const isDataUri = src != null && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src));
    const showPlaceholder = src == null || isStackFailed || (isLoading && !isDataUri);

    const containerStyle = useMemo(
      () => [styles.face, { width: size, height: size, borderRadius }],
      [styles.face, size, borderRadius]
    );

    return (
      <View style={containerStyle}>
        {showPlaceholder && (
          <CryptoLogo name={CryptoLogoNameEnum.CollectiblePlaceholder} size={size} internalSize={size} />
        )}
        {src == null ? null : isDataUri ? (
          <DataUriImage
            key={src}
            dataUri={src}
            width={size}
            height={size}
            style={styles.collectibleImage}
            onLoad={onSuccess}
            onError={onFail}
          />
        ) : (
          <FastImage
            key={src}
            style={styles.collectibleImage}
            source={{ uri: src }}
            resizeMode="cover"
            onLoad={onSuccess}
            onError={onFail}
          />
        )}
      </View>
    );
  }
);

const ActivityAssetFace = memo<FaceProps>(({ source, kind, isNft, withoutAssetIcon, size, borderRadius }) => {
  const styles = useActivityAssetImageStyles();
  const colors = useColors();

  const sizeStyle = useMemo(() => ({ width: size, height: size, borderRadius }), [size, borderRadius]);

  if (withoutAssetIcon === true || source == null) {
    return (
      <View style={[styles.face, styles.placeholder, sizeStyle]}>
        <IconV2 name={getActivityRowIconName(kind, withoutAssetIcon)} size={16} color={colors.gray1} />
      </View>
    );
  }

  if (source.kind === ActivityAssetImageKind.tokenIcon) {
    return <TokenIcon size={size} thumbnailUri={source.thumbnailUri} isCollectible={isNft} style={sizeStyle} />;
  }

  if (source.kind === ActivityAssetImageKind.cryptoLogo) {
    return <CryptoLogo name={source.name} size={size} internalSize={size} />;
  }

  if (source.kind === ActivityAssetImageKind.evmTokenIcon) {
    return (
      <TokenIcon
        chainKind={TempleChainKind.EVM}
        size={size}
        chainId={source.chainId}
        address={source.contract}
        iconURL={source.iconURL}
        style={sizeStyle}
      />
    );
  }

  return <EvmCollectibleFace imageUri={source.imageUri} size={size} borderRadius={borderRadius} />;
});

interface Props {
  chain: TempleChainKind;
  kind: ActivityRowKind;
  source?: ActivityAssetImageSource;
  isNft?: boolean;
  withoutAssetIcon?: boolean;
}

export const ActivityAssetImage = memo<Props>(({ chain, kind, source, isNft, withoutAssetIcon }) => {
  const styles = useActivityAssetImageStyles();

  const isBundleView = kind === ActivityRowKind.bundle;
  const isNftFace = withoutAssetIcon !== true && isNft === true;
  const faceSize = isBundleView
    ? isNftFace
      ? ACTIVITY_ASSET_STACK_NFT_FACE_SIZE
      : ACTIVITY_ASSET_STACK_TOKEN_FACE_SIZE
    : ACTIVITY_ASSET_IMAGE_SIZE;
  const faceBorderRadius = isNftFace
    ? isBundleView
      ? ACTIVITY_ASSET_STACK_FACE_NFT_BORDER_RADIUS
      : ACTIVITY_ASSET_NFT_BORDER_RADIUS
    : faceSize / 2;
  const medallionNftStyle = isNftFace && styles.stackMedallionNft;
  const medallionBackgroundStyle = withoutAssetIcon === true && styles.stackMedallionWithoutAsset;

  const face = (
    <ActivityAssetFace
      source={source}
      kind={kind}
      isNft={isNftFace}
      withoutAssetIcon={withoutAssetIcon}
      size={faceSize}
      borderRadius={faceBorderRadius}
    />
  );

  return (
    <View style={styles.container}>
      {isBundleView ? (
        <>
          <View style={[styles.stackMedallion, styles.stackBack, medallionNftStyle, medallionBackgroundStyle]} />
          <View style={[styles.stackMedallion, styles.stackMiddle, medallionNftStyle, medallionBackgroundStyle]} />
          <View style={[styles.stackMedallion, styles.stackFront, medallionNftStyle, medallionBackgroundStyle]}>
            {face}
          </View>
        </>
      ) : (
        face
      )}

      {withoutAssetIcon === true ? null : (
        <View style={styles.badge}>
          <CryptoLogo
            name={getChainLogoName(chain)}
            size={ACTIVITY_ASSET_BADGE_LOGO_SIZE}
            internalSize={ACTIVITY_ASSET_BADGE_LOGO_SIZE}
          />
        </View>
      )}
    </View>
  );
});
