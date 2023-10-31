import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback, useEffect } from 'react';
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
import { useApkBuildIdEvent } from 'src/hooks/use-apk-build-id-event';
import { useWalletOpenTacker } from 'src/hooks/use-wallet-open-tacker.hook';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addBlacklistedContactAction } from 'src/store/contact-book/contact-book-actions';
import {
  useContactCandidateAddressSelector,
  useContactsAddressesSelector,
  useIgnoredAddressesSelector
} from 'src/store/contact-book/contact-book-selectors';
import { useShouldShowNewsletterModalSelector } from 'src/store/newsletter/newsletter-selectors';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleAccountsListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { usePushNotificationsEvent } from '../../hooks/use-push-notifications-event';
import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { NotificationsBell } from './notifications-bell/notifications-bell';
import { OnRampOverlay } from './on-ramp-overlay/on-ramp-overlay';
import { Settings } from './settings/settings';
import { TokensList } from './token-list/token-list';
import { WalletSelectors } from './wallet.selectors';
import { WalletStyles } from './wallet.styles';

export const Wallet = memo(() => {
  const dispatch = useDispatch();
  const { pageEvent } = useAnalytics();
  const { navigate } = useNavigation();

  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const account = useAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const contactCandidateAddress = useContactCandidateAddressSelector();
  const ignoredAddresses = useIgnoredAddressesSelector();
  const contactsAddresses = useContactsAddressesSelector();
  const bottomSheetController = useBottomSheetController();
  const shouldShowNewsletterModal = useShouldShowNewsletterModalSelector();

  useApkBuildIdEvent();
  usePushNotificationsEvent();

  const handleCloseButtonPress = () => dispatch(addBlacklistedContactAction(contactCandidateAddress));
  const handleDropdownValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  useEffect(() => {
    if (
      !ignoredAddresses.includes(contactCandidateAddress) &&
      !contactsAddresses.includes(contactCandidateAddress) &&
      !account.find(({ publicKeyHash }) => publicKeyHash === contactCandidateAddress)
    ) {
      bottomSheetController.open();
    }
  }, [contactCandidateAddress]);

  useEffect(() => {
    if (shouldShowNewsletterModal && isAnyBackupMade) {
      navigate(ModalsEnum.Newsletter);
    }
  }, [shouldShowNewsletterModal, isAnyBackupMade]);

  const trackPageOpened = useCallback(() => {
    pageEvent(ScreensEnum.Wallet, '');
  }, []);

  useFocusEffect(trackPageOpened);

  useWalletOpenTacker();

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            onValueChange={handleDropdownValueChange}
            testID={WalletSelectors.accountDropdownButton}
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
      <OnRampOverlay />

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
});
