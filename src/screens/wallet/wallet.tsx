import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { WalletStyles } from './wallet.styles';
import { useShelter } from '../../shelter/shelter';

export const Wallet = () => {
  const hdAccounts = useWalletSelector().hdAccounts;
  const { reveal } = useShelter();

  return (
    <ScreenContainer hasBackButton={false}>
      <Text>List of your wallets:</Text>
      <Text style={WalletStyles.description}>(press to reveal your private key)</Text>

      <TouchableOpacity style={WalletStyles.accountItem} onPress={() => reveal('seedPhrase')}>
        <Text>Seed phrase</Text>
      </TouchableOpacity>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity key={publicKeyHash} style={WalletStyles.accountItem} onPress={() => reveal(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};
