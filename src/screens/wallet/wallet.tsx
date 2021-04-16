import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { WalletStyles } from './wallet.styles';
import { useShelter } from '../../shelter/use-shelter.hook';

export const Wallet = () => {
  const hdAccounts = useWalletSelector().hdAccounts;
  const { revealValue } = useShelter();

  return (
    <ScreenContainer hasBackButton={false}>
      <Text>List of your wallets:</Text>
      <Text style={WalletStyles.description}>(press to reveal your private key)</Text>

      <TouchableOpacity style={WalletStyles.accountItem} onPress={() => revealValue('seedPhrase')}>
        <Text>Seed phrase</Text>
      </TouchableOpacity>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity
          key={publicKeyHash}
          style={WalletStyles.accountItem}
          onPress={() => revealValue(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};
