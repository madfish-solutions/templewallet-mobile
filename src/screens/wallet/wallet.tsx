import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useBottomSheet } from '../../components/bottom-sheet/use-bottom-sheet.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadAssetsActions } from '../../store/assets/assets-actions';
import { useAssetsSelector } from '../../store/assets/assets-selectors';
import { useFirstAccountSelector } from '../../store/wallet/wallet-selectors';
import { ReceiveBottomSheet } from './receive-bottom-sheet/receive-bottom-sheet';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const firstAccount = useFirstAccountSelector();
  const assets = useAssetsSelector();

  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose, onDismiss } = useBottomSheet();

  useEffect(() => void dispatch(loadAssetsActions.submit(firstAccount.publicKeyHash)), []);

  return (
    <ScreenContainer>
      <TouchableOpacity style={WalletStyles.accountInfo} onPress={() => null}>
        <Text style={WalletStyles.accountName}>{firstAccount.name}</Text>
        <Text style={WalletStyles.accountKey}>{firstAccount.publicKeyHash}</Text>
      </TouchableOpacity>
      <Text style={WalletStyles.amount}>X XXX.XX XTZ</Text>
      <Text style={WalletStyles.formatted}>= XX XXX.XX $</Text>
      <View style={WalletStyles.buttonRow}>
        <TouchableOpacity onPress={onOpen}>
          <Text style={WalletStyles.button}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => null}>
          <Text style={WalletStyles.button}>Send</Text>
        </TouchableOpacity>
      </View>
      {assets.map(({ token_id, name, balance }) => (
        <TouchableOpacity key={token_id} style={WalletStyles.accountItem} onPress={() => null}>
          <Text>{name}</Text>
          <Text>{balance}</Text>
        </TouchableOpacity>
      ))}

      <ReceiveBottomSheet isOpen={isOpen} onClose={onClose} onDismiss={onDismiss} />
    </ScreenContainer>
  );
};
