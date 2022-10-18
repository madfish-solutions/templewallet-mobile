import React from 'react';
import { TouchableOpacity, View } from 'react-native';
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
import { useIsEveryNewsSeenSelector } from '../../store/news/news-selectors';
import { setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleAccountsListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NotificationIcon } from '../notifications/icons/notification.icon';
import { CollectiblesHomeSwipeButton } from './collectibles-home-swipe-button/collectibles-home-swipe-button';
import { TokenList } from './token-list/token-list';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isDotVisible = useIsEveryNewsSeenSelector();

  usePageAnalytic(ScreensEnum.Wallet);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Divider />

          <TouchableIcon name={IconNameEnum.QrScanner} onPress={() => navigate(ScreensEnum.ScanQrCode)} />
          <Divider size={formatSize(24)} />
          <TouchableOpacity onPress={() => navigate(ScreensEnum.Notifications)}>
            <NotificationIcon isNotification={isDotVisible === false} />
          </TouchableOpacity>
        </View>

        <TokenEquityValue token={tezosToken} showTokenValue={false} />

        <HeaderCardActionButtons token={tezosToken} />

        <Divider size={formatSize(16)} />

        <CollectiblesHomeSwipeButton />
      </HeaderCard>
      <TokenList />
    </>
  );
};
