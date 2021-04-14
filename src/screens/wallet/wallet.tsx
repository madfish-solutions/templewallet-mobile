import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const hdAccounts = useWalletSelector().hdAccounts;

  const revealPrivateKey = (publicKeyHash: string) => console.log('revealPrivateKey', publicKeyHash);

  return (
    <ScreenContainer hasBackButton={false}>
      <Text>List of your wallets:</Text>
      <Text style={WalletStyles.description}>(press to reveal your private key)</Text>

      {hdAccounts.map(({ name, publicKeyHash }) => (
        <TouchableOpacity
          key={publicKeyHash}
          style={WalletStyles.accountItem}
          onPress={() => revealPrivateKey(publicKeyHash)}>
          <Text>{name}</Text>
          <Text>{publicKeyHash}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};
