import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { BrokenImage } from 'src/components/broken-image';
import { useCollectibleImageStyles } from 'src/components/collectible-image/styles';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DataUriImage } from 'src/components/data-uri-image';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { EvmDisplayedCollectible } from 'src/utils/assets/types';
import { buildEvmCollectibleImagesStack, isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { Balance } from './balance';
import { useCollectibleItemStyles, useEvmCollectibleChainBadgeStyles } from './styles';

interface Props {
  collectible: EvmDisplayedCollectible;
  size: number;
  showInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EvmCollectibleItem = memo<Props>(({ collectible, size, showInfo = false, style }) => {
  const navigateToModal = useNavigateToModal();
  const styles = useCollectibleItemStyles();
  const badgeStyles = useEvmCollectibleChainBadgeStyles();

  const { metadata, tokenId, balance } = collectible;
  const displayName = metadata?.collectibleName ?? metadata?.name ?? tokenId;
  const imageUri = metadata?.image ?? metadata?.iconURL;

  return (
    <SafeTouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigateToModal(ModalsEnum.EvmCollectibleModal, collectible)}
      style={[styles.root, style, { width: size }]}
    >
      <View style={[styles.image, { width: size, height: size }]}>
        <EvmCollectibleImage uri={imageUri} size={size} />

        {showInfo ? <Balance balance={balance} /> : null}

        <View style={badgeStyles.badge}>
          <CryptoLogo name={CryptoLogoNameEnum.Etherlink} size={formatSize(12)} internalSize={formatSize(12)} />
        </View>
      </View>

      {showInfo ? (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {displayName}
          </Text>

          <Text style={styles.price} />
        </View>
      ) : null}
    </SafeTouchableOpacity>
  );
});

interface EvmCollectibleImageProps {
  uri?: string;
  size: number;
}

const EvmCollectibleImage = memo<EvmCollectibleImageProps>(({ uri, size }) => {
  const styles = useCollectibleImageStyles();

  const sourcesStack = useMemo(() => buildEvmCollectibleImagesStack(uri), [uri]);

  const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sourcesStack);

  if (isStackFailed) {
    return <BrokenImage isBigIcon={false} style={styles.brokenImage} />;
  }

  if (src && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src))) {
    return (
      <DataUriImage dataUri={src} width={size} height={size} style={styles.image} onLoad={onSuccess} onError={onFail} />
    );
  }

  return (
    <>
      <FastImage
        style={[styles.image, { height: size, width: size }]}
        source={{ uri: src }}
        resizeMode="contain"
        onError={onFail}
        onLoad={onSuccess}
      />

      {isLoading ? <ActivityIndicator size="small" /> : null}
    </>
  );
});
