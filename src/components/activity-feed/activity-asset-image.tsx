import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

import { ActivityOperTransferType } from 'src/activity/types';
import { AssetIconPlaceholder } from 'src/components/asset-icon-placeholder';
import { CryptoLogo } from 'src/components/crypto-logo';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { IconV2 } from 'src/components/icon-v2';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { useColors } from 'src/styles/use-colors';
import { buildEvmCollectibleImagesStack } from 'src/utils/image.utils';

import {
  ACTIVITY_ASSET_BADGE_LOGO_SIZE,
  ACTIVITY_ASSET_IMAGE_SIZE,
  ACTIVITY_ASSET_NFT_BORDER_RADIUS,
  ACTIVITY_ASSET_STACK_FACE_NFT_BORDER_RADIUS,
  ACTIVITY_ASSET_STACK_FACE_SIZE,
  useActivityAssetImageStyles
} from './activity-asset-image.styles';
import { ActivityAssetImageKind, ActivityAssetImageSource, ActivityFaceKind, BUNDLE_FACE_KIND } from './types';
import { getActivityKindIconName } from './utils';

interface FaceProps {
  source?: ActivityAssetImageSource;
  kind: ActivityFaceKind;
  transferType?: ActivityOperTransferType;
  size: number;
  borderRadius: number;
}

const EvmCollectibleFace = memo<{ imageUri?: string; size: number; borderRadius: number }>(
  ({ imageUri, size, borderRadius }) => {
    const styles = useActivityAssetImageStyles();
    const sourcesStack = useMemo(() => buildEvmCollectibleImagesStack(imageUri), [imageUri]);
    const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sourcesStack);

    const showPlaceholder = src == null || isLoading || isStackFailed;

    const containerStyle = useMemo(
      () => [styles.face, styles.placeholder, { width: size, height: size, borderRadius }],
      [styles.face, styles.placeholder, size, borderRadius]
    );

    return (
      <View style={containerStyle}>
        {showPlaceholder && <AssetIconPlaceholder isCollectible size={size} />}
        {src == null ? null : (
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

const ActivityAssetFace = memo<FaceProps>(({ source, kind, transferType, size, borderRadius }) => {
  const styles = useActivityAssetImageStyles();
  const colors = useColors();

  const sizeStyle = useMemo(() => ({ width: size, height: size, borderRadius }), [size, borderRadius]);

  if (source == null) {
    return (
      <View style={[styles.face, styles.placeholder, sizeStyle]}>
        <IconV2 name={getActivityKindIconName(kind, transferType)} size={16} color={colors.gray1} />
      </View>
    );
  }

  if (source.kind === ActivityAssetImageKind.tokenIcon) {
    return <TokenIcon size={size} thumbnailUri={source.thumbnailUri} style={sizeStyle} />;
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
  kind: ActivityFaceKind;
  transferType?: ActivityOperTransferType;
  source?: ActivityAssetImageSource;
  isNft?: boolean;
}

export const ActivityAssetImage = memo<Props>(({ chain, kind, transferType, source, isNft }) => {
  const styles = useActivityAssetImageStyles();

  const isBundleView = kind === BUNDLE_FACE_KIND;
  const faceSize = isBundleView ? ACTIVITY_ASSET_STACK_FACE_SIZE : ACTIVITY_ASSET_IMAGE_SIZE;
  const faceBorderRadius =
    isNft === true
      ? isBundleView
        ? ACTIVITY_ASSET_STACK_FACE_NFT_BORDER_RADIUS
        : ACTIVITY_ASSET_NFT_BORDER_RADIUS
      : faceSize / 2;
  const medallionNftStyle = isNft === true && styles.stackMedallionNft;

  const face = (
    <ActivityAssetFace
      source={source}
      kind={kind}
      transferType={transferType}
      size={faceSize}
      borderRadius={faceBorderRadius}
    />
  );

  return (
    <View style={styles.container}>
      {isBundleView ? (
        <>
          <View style={[styles.stackMedallion, styles.stackBack, medallionNftStyle]} />
          <View style={[styles.stackMedallion, styles.stackMiddle, medallionNftStyle]} />
          <View style={[styles.stackMedallion, styles.stackFront, medallionNftStyle]}>{face}</View>
        </>
      ) : (
        face
      )}

      <View style={styles.badge}>
        <CryptoLogo
          name={getChainLogoName(chain)}
          size={ACTIVITY_ASSET_BADGE_LOGO_SIZE}
          internalSize={ACTIVITY_ASSET_BADGE_LOGO_SIZE}
        />
      </View>
    </View>
  );
});
