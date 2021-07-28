import React, { FC } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { Switch } from '../../../components/switch/switch';
import { TokenContainer } from '../../../components/token-container/token-container';
import { removeTokenAction, toggleTokenVisibilityAction } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';

interface Props {
  token: TokenInterface;
}

export const ManageAssetsItem: FC<Props> = ({ token }) => {
  const dispatch = useDispatch();
  const slug = getTokenSlug(token);

  const handleTrashIconPress = () =>
    Alert.alert('Delete token?', 'You can add this token again in the same menu in the "Add token" section.', [
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
    <TokenContainer token={token}>
      <TouchableIcon name={IconNameEnum.Trash} size={formatSize(16)} onPress={handleTrashIconPress} />
      <Divider size={formatSize(16)} />
      <Switch value={token.isVisible} onChange={() => dispatch(toggleTokenVisibilityAction(slug))} />
    </TokenContainer>
  );
};
