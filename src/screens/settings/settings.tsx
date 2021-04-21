import React from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { SettingsStyles } from './settings.styles';

export const Settings = () => {
  const { lock } = useAppLock();
  const hdAccounts = useWalletSelector().hdAccounts;
  const { revealValue } = useShelter();

  return (
    <ScreenContainer hasBackButton={false}>
      <Button title="Lock app" onPress={lock} />
      <EraseDataButton />
      <Text>List of your wallets:</Text>
      <Text style={SettingsStyles.description}>(press to reveal your private key)</Text>

      <TouchableOpacity style={SettingsStyles.accountItem} onPress={() => revealValue('seedPhrase')}>
        <Text>Seed phrase</Text>
      </TouchableOpacity>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity
          key={publicKeyHash}
          style={SettingsStyles.accountItem}
          onPress={() => revealValue(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};
