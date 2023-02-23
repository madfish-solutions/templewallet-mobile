import React, { FC } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { Switch } from 'src/components/switch/switch';
import { TokenContainer } from 'src/components/token-container/token-container';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { removeTokenAction, toggleTokenVisibilityAction } from 'src/store/wallet/wallet-actions';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

interface Props {
  asset: TokenInterface;
}

export const ManageAssetsItem: FC<Props> = ({ asset }) => {
  const dispatch = useDispatch();
  const slug = getTokenSlug(asset);

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const { isTezosNode } = useNetworkInfo();

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
    <TokenContainer token={asset}>
      {isTezosNode && <TouchableIcon name={IconNameEnum.Trash} size={formatSize(16)} onPress={handleTrashIconPress} />}
      <Divider size={formatSize(16)} />
      <Switch
        value={asset.visibility === VisibilityEnum.Visible}
        onChange={() => dispatch(toggleTokenVisibilityAction({ slug, selectedRpcUrl }))}
      />
    </TokenContainer>
  );
};
