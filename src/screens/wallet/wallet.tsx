import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountDropdown } from '../../components/account-dropdown/account-dropdown';
import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import {
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from '../../store/wallet/wallet-actions';
import {
  useHdAccountsListSelector,
  useSelectedAccountSelector,
  useTezosBalanceSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { ReceiveBottomSheet } from './receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from './send-bottom-sheet/send-bottom-sheet';
import { TokenListItem } from './token-list-item/token-list-item';
import { useWalletStyles } from './wallet.styles';
import { Icon } from '../../components/icon/icon';
import { formatSize } from '../../styles/format-size';

export const Wallet = () => {
  const styles = useWalletStyles();
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountsListSelector();
  const tokensList = useTokensListSelector();
  const tezosBalance = useTezosBalanceSelector();

  const receiveBottomSheetController = useBottomSheetController();
  const sendBottomSheetController = useBottomSheetController();

  useEffect(() => {
    dispatch(loadTokenBalancesActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadTezosBalanceActions.submit(selectedAccount.publicKeyHash));
  }, [selectedAccount.publicKeyHash]);

  return (
    <>
      <View style={styles.headerCard}>
        <InsetSubstitute />

        <View style={styles.accountContainer}>
          <AccountDropdown
            value={selectedAccount}
            list={hdAccounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Icon name={IconNameEnum.QrScanner} size={formatSize(24)} />
        </View>

        <View style={styles.equityContainer}>
          <View style={styles.equityHeader}>
            <Icon name={IconNameEnum.EyeOpenBold} size={formatSize(24)} />
            <Text style={styles.equityDateText}>Equity Value (XTZ) 12 May 2021</Text>
          </View>
          <Text style={styles.equityXtzText}>X XXX.XX XTZ</Text>
          <Text style={styles.equityUsdText}>≈ XX XXX.XX $</Text>
        </View>

        <View style={styles.buttonsContainer}>
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
      </View>
      <ScreenContainer>
        <TokenListItem
          symbol={XTZ_TOKEN_METADATA.symbol}
          name={XTZ_TOKEN_METADATA.name}
          balance={tezosBalance}
          apy={8}
          iconName={XTZ_TOKEN_METADATA.iconName}
        />

        {tokensList.map(({ address, symbol, name, balance, iconName }) => (
          <TokenListItem key={address} symbol={symbol} name={name} balance={balance} iconName={iconName} />
        ))}

        <Divider />

        <ReceiveBottomSheet controller={receiveBottomSheetController} />
        <SendBottomSheet controller={sendBottomSheetController} />
      </ScreenContainer>
    </>
  );
};
