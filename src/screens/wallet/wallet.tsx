import React, { useState } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { WalletStyles } from './wallet.styles';
import { useBottomSheet } from '../../components/bottom-sheet/use-bottom-sheet.hook';

export const Wallet = () => {
  const hdAccounts = useWalletSelector().hdAccounts;
  const { revealValue } = useShelter();

  const { isOpen, open, close, onDismiss } = useBottomSheet();

  return (
    <ScreenContainer hasBackButton={false}>
      <Button title="Open Bottom Sheet" onPress={open} />
      <Button title="Close Bottom Sheet" onPress={close} />

      <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
        <Text>Awesome 🎉</Text>
      </BottomSheet>

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
