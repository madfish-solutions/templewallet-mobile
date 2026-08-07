import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

import { ActivityOperTransferType } from 'src/activity/types';
import { CryptoLogo } from 'src/components/crypto-logo';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { IconV2 } from 'src/components/icon-v2';
import { EvmTokenIcon } from 'src/components/token-icon/evm-token-icon';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { useColors } from 'src/styles/use-colors';
import { buildEvmCollectibleImagesStack } from 'src/utils/image.utils';

import {
  ACTIVITY_ASSET_BADGE_LOGO_SIZE,
  ACTIVITY_ASSET_IMAGE_SIZE,
  ACTIVITY_ASSET_NFT_BORDER_RADIUS,
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
    const { src, onSuccess, onFail } = useImagesStack(sourcesStack);

    const containerStyle = useMemo(
      () => [styles.face, { width: size, height: size, borderRadius }],
      [styles.face, size, borderRadius]
    );

    return (
      <View style={containerStyle}>
        {src == null ? null : (
          <FastImage
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
      <EvmTokenIcon
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
  const faceBorderRadius = !isBundleView && isNft === true ? ACTIVITY_ASSET_NFT_BORDER_RADIUS : faceSize / 2;

  const face = (
    <ActivityAssetFace
      // An NFT-led bundle shows the generic bundle icon; a token-led one keeps its token image
      source={isBundleView && isNft === true ? undefined : source}
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
          <View style={[styles.stackMedallion, styles.stackBack]} />
          <View style={[styles.stackMedallion, styles.stackMiddle]} />
          <View style={[styles.stackMedallion, styles.stackFront]}>{face}</View>
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
