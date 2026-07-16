import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { BrokenImage } from 'src/components/broken-image';
import { useCollectibleImageStyles } from 'src/components/collectible-image/styles';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { buildEvmCollectibleImagesStack } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { Balance } from './balance';
import { useCollectibleItemStyles, useEvmCollectibleChainBadgeStyles } from './styles';

interface Props {
  collectible: TokenInterface;
  size: number;
  showInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EvmCollectibleItem = memo<Props>(({ collectible, size, showInfo = false, style }) => {
  const styles = useCollectibleItemStyles();
  const badgeStyles = useEvmCollectibleChainBadgeStyles();

  const balance = collectible.balance;

  return (
    <View style={[styles.root, style, { width: size }]}>
      <View style={[styles.image, { width: size, height: size }]}>
        <EvmCollectibleImage uri={collectible.artifactUri} size={size} />

        {showInfo && isDefined(balance) ? <Balance balance={balance} /> : null}

        <View style={badgeStyles.badge}>
          <Icon name={IconNameEnum.EtherlinkToken} size={formatSize(12)} />
        </View>
      </View>

      {showInfo ? (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {collectible.name}
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
