import React, { useState } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const hdAccounts = useWalletSelector().hdAccounts;
  const { revealValue } = useShelter();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenButtonPress = () => setIsOpen(true);
  const handleCloseButtonPress = () => setIsOpen(false);

  return (
    <ScreenContainer hasBackButton={false}>
      <Button title="Open" onPress={handleOpenButtonPress} />
      <Button title="Close" onPress={handleCloseButtonPress} />
      <BottomSheet isOpen={isOpen} />

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
