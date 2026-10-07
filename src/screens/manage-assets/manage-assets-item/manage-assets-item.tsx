import React, { FC } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CollectibleImage } from 'src/components/collectible-image';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { MultichainTokenIcon, MultichainTokenIconProps } from 'src/components/multichain-token-icon';
import { useMultichainTokenIconStyles } from 'src/components/multichain-token-icon/styles';
import { NetworkIcon } from 'src/components/network-icon';
import { Switch } from 'src/components/switch/switch';
import { TezosCollectibleThumbnail } from 'src/components/tezos-collectible-thumbnail';
import { TokenContainer } from 'src/components/token-container/token-container';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { setEvmAssetVisibilityAction } from 'src/store/evm/assets/evm-assets-actions';
import { removeTokenAction, toggleTokenVisibilityAction } from 'src/store/wallet/wallet-actions';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isCollectibleAsset } from 'src/utils/asset.utils';
import { isEvmCollectibleManageAsset, isEvmManageAsset, ManageAsset } from 'src/utils/assets/hooks';

interface Props {
  asset: ManageAsset;
}

const ASSET_ICON_SIZE = formatSize(40);
const ASSET_IMAGE_SIZE = formatSize(34);
const ManageCollectibleFallback = () => (
  <CryptoLogo
    name={CryptoLogoNameEnum.CollectiblePlaceholder}
    size={ASSET_IMAGE_SIZE}
    internalSize={ASSET_IMAGE_SIZE}
  />
);
const styles = StyleSheet.create({
  collectibleIcon: {
    top: formatSize(2)
  },
  collectibleFrame: {
    height: ASSET_ICON_SIZE,
    padding: formatSize(2),
    width: ASSET_ICON_SIZE
  },
  collectibleImage: {
    borderRadius: formatSize(8),
    height: ASSET_IMAGE_SIZE,
    overflow: 'hidden',
    width: ASSET_IMAGE_SIZE
  }
});

export const ManageAssetsItem: FC<Props> = ({ asset }) => {
  const dispatch = useDispatch();
  const iconStyles = useMultichainTokenIconStyles();
  const evmAddress = useAccountAddressForEvm();
  const isEvmAsset = isEvmManageAsset(asset);
  const slug = isEvmAsset ? asset.assetSlug : getTokenSlug(asset);
  const isNetworkToken = isEvmAsset ? asset.standard === EvmAssetStandardEnum.NATIVE : slug === TEZ_TOKEN_SLUG;
  const isVisible = isNetworkToken || (isEvmAsset ? asset.isVisible : asset.visibility === VisibilityEnum.Visible);
  const isCollectible = isEvmAsset ? isEvmCollectibleManageAsset(asset) : isCollectibleAsset(asset);
  const iconProps: MultichainTokenIconProps = isEvmAsset
    ? {
        chainKind: TempleChainKind.EVM,
        chainId: asset.chainId,
        address: asset.assetSlug,
        iconName: asset.iconName,
        iconURL: asset.thumbnailUri,
        isCollectible
      }
    : {
        chainKind: TempleChainKind.Tezos,
        iconName: asset.iconName,
        thumbnailUri: asset.thumbnailUri,
        isCollectible
      };

  const leadingIcon = isCollectible ? (
    <View style={[iconStyles.container, styles.collectibleIcon]}>
      <View style={styles.collectibleFrame}>
        <View style={styles.collectibleImage}>
          {isEvmAsset ? (
            <CollectibleImage
              chainKind={TempleChainKind.EVM}
              slug={asset.assetSlug}
              chainId={asset.chainId}
              uri={asset.thumbnailUri}
              size={ASSET_IMAGE_SIZE}
              Fallback={ManageCollectibleFallback}
              resizeMode="cover"
            />
          ) : (
            <TezosCollectibleThumbnail
              slug={slug}
              artifactUri={asset.artifactUri}
              displayUri={asset.displayUri}
              thumbnailUri={asset.thumbnailUri}
              size={ASSET_IMAGE_SIZE}
              blurAdultContent={false}
              Fallback={ManageCollectibleFallback}
              resizeMode="cover"
            />
          )}
        </View>
      </View>
      <View style={iconStyles.networkBadge}>
        <NetworkIcon name={isEvmAsset ? CryptoLogoNameEnum.Etherlink : CryptoLogoNameEnum.Tezos} variant="tokenBadge" />
      </View>
    </View>
  ) : (
    <MultichainTokenIcon {...iconProps} size={ASSET_ICON_SIZE} showNetworkBadge />
  );

  const setEvmVisibility = (visibility: VisibilityEnum) => {
    if (evmAddress && isEvmAsset) {
      dispatch(
        setEvmAssetVisibilityAction({
          account: evmAddress,
          chainId: asset.chainId,
          slug,
          visibility
        })
      );
    }
  };

  const handleTrashIconPress = () =>
    Alert.alert(
      isEvmAsset ? 'Hide asset?' : 'Delete asset?',
      isEvmAsset
        ? 'You can show this asset again using the switch in this list.'
        : 'You can add this asset again in the same menu in the "Add asset" section.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: isEvmAsset ? 'Hide' : 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isEvmAsset) {
              setEvmVisibility(VisibilityEnum.Hidden);
            } else {
              dispatch(removeTokenAction(slug));
            }
          }
        }
      ]
    );

  return (
    <TokenContainer token={asset} showTokenTag={false} leadingIcon={leadingIcon}>
      <TouchableIconV2
        name={IconNameV2Enum.Trash}
        size={formatSize(16)}
        iconSize={16}
        disabled={isNetworkToken}
        onPress={handleTrashIconPress}
      />
      <Divider size={formatSize(16)} />
      <Switch
        value={isVisible}
        disabled={isNetworkToken}
        onChange={() =>
          isEvmAsset
            ? setEvmVisibility(isVisible ? VisibilityEnum.Hidden : VisibilityEnum.Visible)
            : dispatch(toggleTokenVisibilityAction({ slug }))
        }
      />
    </TokenContainer>
  );
};
