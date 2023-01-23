import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from '../../components/divider/divider';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { useWalletOpenTacker } from '../../hooks/use-wallet-open-tacker.hook';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { addBlacklistedContactAction } from '../../store/contact-book/contact-book-actions';
import {
  useContactCandidateAddressSelector,
  useBlacklistedAddressesSelector
} from '../../store/contact-book/contact-book-selectors';
import { setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleAccountsListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { CollectiblesHomeSwipeButton } from './collectibles-home-swipe-button/collectibles-home-swipe-button';
import { NotificationsBell } from './notifications-bell/notifications-bell';
import { TokenList } from './token-list/token-list';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const contactCandidateAddress = useContactCandidateAddressSelector();
  const blacklistedAddresses = useBlacklistedAddressesSelector();
  const bottomSheetController = useBottomSheetController();

  const handleCloseButtonPress = () => dispatch(addBlacklistedContactAction(contactCandidateAddress));

  useEffect(() => {
    if (!blacklistedAddresses.includes(contactCandidateAddress)) {
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
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Divider />

          <TouchableIcon name={IconNameEnum.QrScanner} onPress={() => navigate(ScreensEnum.ScanQrCode)} />
          <Divider size={formatSize(24)} />
          <NotificationsBell />
        </View>

        <TokenEquityValue token={tezosToken} showTokenValue={false} />

        <HeaderCardActionButtons token={tezosToken} />

        <Divider size={formatSize(16)} />

        <CollectiblesHomeSwipeButton />
      </HeaderCard>
      <TokenList />

      <BackupYourWalletOverlay />

      <BottomSheet
        title="Add this address to Contacts?"
        description={contactCandidateAddress}
        cancelButtonText="Now now"
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
        />
      </BottomSheet>
    </>
  );
};
