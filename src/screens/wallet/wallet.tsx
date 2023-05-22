import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from 'src/components/divider/divider';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from 'src/components/header-card/header-card';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { useWalletOpenTacker } from 'src/hooks/use-wallet-open-tacker.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addBlacklistedContactAction } from 'src/store/contact-book/contact-book-actions';
import {
  useContactCandidateAddressSelector,
  useContactsAddressesSelector,
  useIgnoredAddressesSelector
} from 'src/store/contact-book/contact-book-selectors';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleAccountsListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { NotificationsBell } from './notifications-bell/notifications-bell';
import { Settings } from './settings/settings';
import { TokensList } from './token-list/token-list';
import { WalletSelectors } from './wallet.selectors';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { trackEvent } = useAnalytics();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const contactCandidateAddress = useContactCandidateAddressSelector();
  const ignoredAddresses = useIgnoredAddressesSelector();
  const contactsAddresses = useContactsAddressesSelector();
  const bottomSheetController = useBottomSheetController();

  const handleCloseButtonPress = () => dispatch(addBlacklistedContactAction(contactCandidateAddress));

  useEffect(() => {
    if (!ignoredAddresses.includes(contactCandidateAddress) && !contactsAddresses.includes(contactCandidateAddress)) {
      bottomSheetController.open();
    }
  }, [contactCandidateAddress]);

  useWalletOpenTacker();
  usePageAnalytic(ScreensEnum.Wallet);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            onValueChange={value => {
              trackEvent(WalletSelectors.accountDropdown, AnalyticsEventCategory.ButtonPress);
              dispatch(setSelectedAccountAction(value?.publicKeyHash));
            }}
          />

          <Divider />

          <TouchableIcon
            name={IconNameEnum.QrScanner}
            onPress={() => navigate(ScreensEnum.ScanQrCode)}
            testID={WalletSelectors.scanQRButton}
          />
          <Divider size={formatSize(24)} />
          <NotificationsBell />
          <Divider size={formatSize(24)} />
          <Settings />
        </View>

        <TokenEquityValue token={tezosToken} showTokenValue={false} />

        <HeaderCardActionButtons token={tezosToken} />
      </HeaderCard>

      <TokensList />

      <BackupYourWalletOverlay />

      <BottomSheet
        title="Add this address to Contacts?"
        description={contactCandidateAddress}
        cancelButtonText="Not now"
        contentHeight={formatSize(180)}
        controller={bottomSheetController}
        onCancelButtonPress={handleCloseButtonPress}
      >
        <BottomSheetActionButton
          title="Add address"
          onPress={() => {
            navigate(ModalsEnum.AddContact, { name: '', publicKeyHash: contactCandidateAddress });
            bottomSheetController.close();
          }}
          testID={WalletSelectors.addAddressButton}
        />
      </BottomSheet>
    </>
  );
};
