import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import {
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from '../../store/wallet/wallet-actions';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { TokenList } from './token-list/token-list';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const accounts = useAccountsListSelector();
  const tezosToken = useTezosTokenSelector();

  useEffect(() => {
    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadTokenBalancesActions.submit());
    dispatch(loadActivityGroupsActions.submit());
  }, []);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={accounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <TouchableIcon name={IconNameEnum.QrScanner} onPress={() => navigate(ScreensEnum.ScanQrCode)} />
        </View>

        <TokenEquityValue token={tezosToken} />

        <HeaderCardActionButtons token={tezosToken} />
      </HeaderCard>

      <TokenList />
    </>
  );
};
