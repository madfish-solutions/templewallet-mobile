import React, { FC } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { MultichainTokenIcon, MultichainTokenIconProps } from 'src/components/multichain-token-icon';
import { Switch } from 'src/components/switch/switch';
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
const ITEM_VERTICAL_PADDING = formatSize(8);

export const ManageAssetsItem: FC<Props> = ({ asset }) => {
  const dispatch = useDispatch();
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
    <TokenContainer
      token={asset}
      style={{ paddingVertical: ITEM_VERTICAL_PADDING }}
      showTokenTag={false}
      leadingIcon={<MultichainTokenIcon {...iconProps} size={ASSET_ICON_SIZE} showNetworkBadge />}
    >
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
