import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { BrokenImage } from 'src/components/broken-image';
import { useCollectibleImageStyles } from 'src/components/collectible-image/styles';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { EvmDisplayedCollectible } from 'src/utils/assets/types';
import { buildEvmCollectibleImagesStack } from 'src/utils/image.utils';

import { Balance } from './balance';
import { useCollectibleItemStyles, useEvmCollectibleChainBadgeStyles } from './styles';

interface Props {
  collectible: EvmDisplayedCollectible;
  size: number;
  showInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EvmCollectibleItem = memo<Props>(({ collectible, size, showInfo = false, style }) => {
  const styles = useCollectibleItemStyles();
  const badgeStyles = useEvmCollectibleChainBadgeStyles();

  const { metadata, tokenId, balance } = collectible;
  const displayName = metadata?.collectibleName ?? metadata?.name ?? tokenId;
  const imageUri = metadata?.image ?? metadata?.iconURL;

  return (
    <View style={[styles.root, style, { width: size }]}>
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
    </View>
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
