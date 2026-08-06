import React, { FC } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { MultichainTokenIcon } from 'src/components/multichain-token-icon';
import { Switch } from 'src/components/switch/switch';
import { TokenContainer } from 'src/components/token-container/token-container';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { removeTokenAction, toggleTokenVisibilityAction } from 'src/store/wallet/wallet-actions';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isCollectibleAsset } from 'src/utils/asset.utils';

interface Props {
  asset: TokenInterface;
}

const ASSET_ICON_SIZE = formatSize(40);
const ITEM_VERTICAL_PADDING = formatSize(8);

export const ManageAssetsItem: FC<Props> = ({ asset }) => {
  const dispatch = useDispatch();
  const slug = getTokenSlug(asset);

  const handleTrashIconPress = () =>
    Alert.alert('Delete asset?', 'You can add this asset again in the same menu in the "Add asset" section.', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeTokenAction(slug))
      }
    ]);

  return (
    <TokenContainer
      token={asset}
      style={{ paddingVertical: ITEM_VERTICAL_PADDING }}
      leadingIcon={
        <MultichainTokenIcon
          chainKind={TempleChainKind.Tezos}
          iconName={asset.iconName}
          thumbnailUri={asset.thumbnailUri}
          isCollectible={isCollectibleAsset(asset)}
          size={ASSET_ICON_SIZE}
          showNetworkBadge
        />
      }
    >
      <TouchableIconV2 name={IconNameV2Enum.Trash} size={formatSize(16)} iconSize={16} onPress={handleTrashIconPress} />
      <Divider size={formatSize(16)} />
      <Switch
        value={asset.visibility === VisibilityEnum.Visible}
        onChange={() => dispatch(toggleTokenVisibilityAction({ slug }))}
      />
    </TokenContainer>
  );
};
