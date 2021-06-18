import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { loadActivityGroupsActions } from '../../store/activity/activity-actions';
import {
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from '../../store/wallet/wallet-actions';
import {
  useHdAccountsListSelector,
  useSelectedAccountSelector,
  useTezosBalanceSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenList } from './token-list/token-list';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const colors = useColors();
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountsListSelector();
  const tezosBalance = useTezosBalanceSelector();

  useEffect(() => {
    dispatch(loadTezosBalanceActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadTokenBalancesActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash));
  }, []);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={hdAccounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Icon name={IconNameEnum.QrScanner} size={formatSize(24)} color={colors.disabled} />
        </View>

        <TokenEquityValue balance={tezosBalance} symbol={XTZ_TOKEN_METADATA.symbol} />

        <HeaderCardActionButtons asset={XTZ_TOKEN_METADATA} />
      </HeaderCard>

      <TokenList tezosBalance={tezosBalance} />
    </>
  );
};
