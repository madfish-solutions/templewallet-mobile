import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useBottomSheet } from '../../components/bottom-sheet/use-bottom-sheet.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadTezosAssetsActions, loadTokenAssetsActions } from '../../store/assets/assets-actions';
import { useAssetsSelector, useBalanceSelector } from '../../store/assets/assets-selectors';
import { useFirstAccountSelector } from '../../store/wallet/wallet-selectors';
import { ReceiveBottomSheet } from './receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from './send-bottom-sheet/send-bottom-sheet';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const firstAccount = useFirstAccountSelector();
  const assets = useAssetsSelector();
  const balance = useBalanceSelector();

  const dispatch = useDispatch();
  const receiveBottomSheet = useBottomSheet();
  const sendBottomSheet = useBottomSheet();

  useEffect(() => {
    dispatch(loadTokenAssetsActions.submit(firstAccount.publicKeyHash));
    dispatch(loadTezosAssetsActions.submit(firstAccount.publicKeyHash));
  }, []);

  return (
    <ScreenContainer>
      <TouchableOpacity style={WalletStyles.accountInfo} onPress={() => null}>
        <Text style={WalletStyles.accountName}>{firstAccount.name}</Text>
        <Text style={WalletStyles.accountKey}>{firstAccount.publicKeyHash}</Text>
      </TouchableOpacity>
      <Text style={WalletStyles.amount}>X XXX.XX XTZ</Text>
      <Text style={WalletStyles.formatted}>= XX XXX.XX $</Text>
      <View style={WalletStyles.buttonRow}>
        <TouchableOpacity onPress={receiveBottomSheet.onOpen}>
          <Text style={WalletStyles.button}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendBottomSheet.onOpen}>
          <Text style={WalletStyles.button}>Send</Text>
        </TouchableOpacity>
      </View>
      {assets.map(({ token_id, name, balance }) => (
        <TouchableOpacity key={token_id} style={WalletStyles.accountItem} onPress={() => null}>
          <Text>{name}</Text>
          <Text>{balance}</Text>
        </TouchableOpacity>
      ))}
      {balance && (
        <TouchableOpacity style={WalletStyles.accountItem} onPress={() => null}>
          <Text>Tezos</Text>
          <Text>{balance}</Text>
        </TouchableOpacity>
      )}

      <SendBottomSheet
        from={firstAccount.publicKeyHash}
        balance={balance}
        isOpen={sendBottomSheet.isOpen}
        onClose={sendBottomSheet.onClose}
        onDismiss={sendBottomSheet.onDismiss}
      />
      <ReceiveBottomSheet
        isOpen={receiveBottomSheet.isOpen}
        onClose={receiveBottomSheet.onClose}
        onDismiss={receiveBottomSheet.onDismiss}
      />
    </ScreenContainer>
  );
};
