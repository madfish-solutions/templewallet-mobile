import React, { FC } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { Switch } from '../../../components/switch/switch';
import { TokenContainer } from '../../../components/token-container/token-container';
import { VisibilityEnum } from '../../../enums/visibility.enum';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { removeTokenAction, toggleTokenVisibilityAction } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';

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
