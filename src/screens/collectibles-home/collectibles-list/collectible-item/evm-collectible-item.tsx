import React, { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { EvmCollectibleImage } from 'src/components/evm-collectible-image';
import { NetworkIcon } from 'src/components/network-icon';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { EvmDisplayedCollectible } from 'src/utils/assets/types';

import { Balance } from './balance';
import { useCollectibleItemStyles } from './styles';

interface Props {
  collectible: EvmDisplayedCollectible;
  size: number;
  showInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EvmCollectibleItem = memo<Props>(({ collectible, size, showInfo = false, style }) => {
  const navigateToModal = useNavigateToModal();
  const styles = useCollectibleItemStyles();

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

        <View style={styles.networkBadge}>
          <NetworkIcon name={CryptoLogoNameEnum.Etherlink} variant="nftBadge" />
        </View>
      </View>

      {showInfo ? (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {displayName}
          </Text>

          <Text style={styles.price}>No value</Text>
        </View>
      ) : null}
    </SafeTouchableOpacity>
  );
});
