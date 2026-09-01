import React, { memo, useCallback, useEffect, useMemo } from 'react';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { addBlacklistedContactAction } from 'src/store/contact-book/contact-book-actions';
import {
  useContactCandidateAddressSelector,
  useContactsAddresses,
  useIgnoredAddressesSelector
} from 'src/store/contact-book/contact-book-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';

import { WalletSelectors } from './wallet.selectors';

export const ContactSuggestion = memo(() => {
  const navigateToModal = useNavigateToModal();
  const contactCandidateAddress = useContactCandidateAddressSelector();
  const ignoredAddresses = useIgnoredAddressesSelector();
  const contactsAddresses = useContactsAddresses();
  const accounts = useAllAccounts();
  const controller = useBottomSheetController();

  const shouldShowSuggestion = useMemo(
    () =>
      Boolean(contactCandidateAddress) &&
      !ignoredAddresses.includes(contactCandidateAddress) &&
      !contactsAddresses.includes(contactCandidateAddress) &&
      !accounts.some(
        account =>
          getAccountAddressForTezos(account) === contactCandidateAddress ||
          getAccountAddressForEvm(account) === contactCandidateAddress
      ),
    [accounts, contactCandidateAddress, contactsAddresses, ignoredAddresses]
  );

  useEffect(() => {
    if (shouldShowSuggestion) {
      controller.open();
    }
  }, [contactCandidateAddress, controller, shouldShowSuggestion]);

  const handleCancel = useCallback(
    () => dispatch(addBlacklistedContactAction(contactCandidateAddress)),
    [contactCandidateAddress]
  );

  const handleAddAddress = useCallback(() => {
    navigateToModal(ModalsEnum.AddContact, {
      name: '',
      address: contactCandidateAddress
    });
    controller.close();
  }, [contactCandidateAddress, controller, navigateToModal]);

  return (
    <BottomSheet
      title="Add this address to Contacts?"
      description={contactCandidateAddress}
      cancelButtonText="Not now"
      contentHeight={formatSize(180)}
      controller={controller}
      onCancelButtonPress={handleCancel}
    >
      <BottomSheetActionButton
        title="Add address"
        onPress={handleAddAddress}
        testID={WalletSelectors.addAddressButton}
      />
    </BottomSheet>
  );
});
