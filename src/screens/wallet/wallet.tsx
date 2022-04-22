import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { Divider } from '../../components/divider/divider';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import {
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from '../../store/wallet/wallet-actions';
import {
  useIsAuthorisedSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useVisibleAccountsListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { CollectiblesHomeSwipeButton } from './collectibles-home-swipe-button/collectibles-home-swipe-button';
import { TokenList } from './token-list/token-list';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const { isLocked } = useAppLock();
  const isAuthorised = useIsAuthorisedSelector();

  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useTezosTokenSelector();

  usePageAnalytic(ScreensEnum.Wallet);

  useEffect(() => {
    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadTokenBalancesActions.submit());
    dispatch(loadActivityGroupsActions.submit());
  }, []);

  return isAuthorised && !isLocked ? (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            autoScroll
            comparator={['publicKeyHash']}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Divider />

          <TouchableIcon name={IconNameEnum.QrScanner} onPress={() => navigate(ScreensEnum.ScanQrCode)} />
        </View>

        <TokenEquityValue token={tezosToken} showTokenValue={false} />

        <HeaderCardActionButtons token={tezosToken} />

        <Divider size={formatSize(16)} />

        <CollectiblesHomeSwipeButton />
      </HeaderCard>

      <TokenList />
    </>
  ) : null;
};
