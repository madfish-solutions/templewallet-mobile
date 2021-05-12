import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { loadTezosAssetsActions, loadTokenAssetsActions } from '../../store/wallet/assets-actions';
import {
  useSelectedAccountSelector,
  useTezosBalanceSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { TezTokenMetadata } from '../../token/data/tokens-metadata';
import { ReceiveBottomSheet } from './receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from './send-bottom-sheet/send-bottom-sheet';
import { TokenListItem } from './token-list-item/token-list-item';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();
  const tokensList = useTokensListSelector();
  const tezosBalance = useTezosBalanceSelector();

  const receiveBottomSheetController = useBottomSheetController();
  const sendBottomSheetController = useBottomSheetController();

  useEffect(() => {
    dispatch(loadTokenAssetsActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadTezosAssetsActions.submit(selectedAccount.publicKeyHash));
  }, [selectedAccount.publicKeyHash]);

  return (
    <ScreenContainer>
      <TouchableOpacity style={WalletStyles.accountInfo} onPress={emptyFn}>
        <Text style={WalletStyles.accountName}>{selectedAccount.name}</Text>
        <Text style={WalletStyles.accountKey}>{selectedAccount.publicKeyHash}</Text>
      </TouchableOpacity>
      <Text style={WalletStyles.amount}>X XXX.XX XTZ</Text>
      <Text style={WalletStyles.formatted}>= XX XXX.XX $</Text>
      <View style={WalletStyles.buttonsContainer}>
        <ButtonMedium
          title="RECEIVE"
          iconName={IconNameEnum.ArrowDown}
          marginRight={step}
          onPress={receiveBottomSheetController.open}
        />
        <ButtonMedium
          title="SEND"
          iconName={IconNameEnum.ArrowUp}
          marginRight={step}
          onPress={sendBottomSheetController.open}
        />
        <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
      </View>

      <TokenListItem
        symbol={TezTokenMetadata.symbol}
        name={TezTokenMetadata.name}
        balance={tezosBalance}
        apy={8}
        iconName={TezTokenMetadata.iconName}
      />

      {tokensList.map(({ address, symbol, name, balance, iconName }) => (
        <TokenListItem key={address} symbol={symbol} name={name} balance={balance} iconName={iconName} />
      ))}

      <ReceiveBottomSheet controller={receiveBottomSheetController} />
      <SendBottomSheet controller={sendBottomSheetController} />
    </ScreenContainer>
  );
};
