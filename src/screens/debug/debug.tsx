import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { AccountTypeEnum } from '../../enums/account-type.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useRecentActionsSelector } from '../../store/debug/debug-selectors';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { formatSize } from '../../styles/format-size';
import { showSuccessToast } from '../../toast/toast.utils';
import { ActionItem } from './action-item/action-item';

export const Debug: FC = () => {
  const recentActions = useRecentActionsSelector();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const [name, setName] = useState('');
  const [publicKeyHash, setPublicKeyHash] = useState('');

  const publicData = {
    name,
    type: AccountTypeEnum.WATCH_ONLY_DEBUG,
    publicKey: 'publicKey',
    publicKeyHash
  };

  const handleImportButtonPress = () => {
    dispatch(setSelectedAccountAction(publicKeyHash));
    dispatch(addHdAccountAction(publicData));
    showSuccessToast({ description: 'Debug Account Imported!' });
    goBack();
  };

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  return (
    <ScreenContainer>
      <StyledTextInput value={name} placeholder="Debug account name" onChangeText={text => setName(text)} />
      <Divider />
      <StyledTextInput
        value={publicKeyHash}
        placeholder="Public Key Hash"
        onChangeText={text => setPublicKeyHash(text)}
      />
      <Divider />
      <ButtonMedium title="Import Debug Acc" iconName={IconNameEnum.Deal} onPress={handleImportButtonPress} />
      <Divider size={formatSize(50)} />
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />

      {recentActions.map(({ timestamp, type, payload, id }) => (
        <ActionItem key={id} timestamp={timestamp} type={type} payload={payload} id={id} />
      ))}
    </ScreenContainer>
  );
};
