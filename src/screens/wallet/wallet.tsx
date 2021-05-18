import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { HeaderCard } from '../../components/header-card/header-card';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
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
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { ReceiveBottomSheet } from './receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from './send-bottom-sheet/send-bottom-sheet';
import { TokenListItem } from './token-list-item/token-list-item';
import { useWalletStyles } from './wallet.styles';

export const Wallet = () => {
  const styles = useWalletStyles();
  const colors = useColors();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

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
      <HeaderCard hasInsetTop={true}>
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={hdAccounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Icon name={IconNameEnum.QrScanner} size={formatSize(24)} color={colors.disabled} />
        </View>

        <TokenEquityValue balance={tezosBalance} symbol={XTZ_TOKEN_METADATA.symbol} />

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
      </HeaderCard>

      <ScreenContainer>
        <TokenListItem
          symbol={XTZ_TOKEN_METADATA.symbol}
          name={XTZ_TOKEN_METADATA.name}
          balance={tezosBalance}
          apy={8}
          iconName={XTZ_TOKEN_METADATA.iconName}
          onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
        />

        {tokensList.map(token => (
          <TokenListItem
            key={token.address}
            symbol={token.symbol}
            name={token.name}
            balance={token.balance}
            iconName={token.iconName}
            onPress={() => navigate(ScreensEnum.TokenScreen, { slug: tokenMetadataSlug(token) })}
          />
        ))}

        <Divider />

        <ReceiveBottomSheet controller={receiveBottomSheetController} />
        <SendBottomSheet controller={sendBottomSheetController} />
      </ScreenContainer>
    </>
  );
};
