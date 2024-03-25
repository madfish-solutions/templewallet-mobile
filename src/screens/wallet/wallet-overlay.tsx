import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useShouldShowNewsletterModalSelector } from 'src/store/newsletter/newsletter-selectors';
import { setStartModalAllowedAction } from 'src/store/settings/settings-actions';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';

import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { OnRampOverlay } from './on-ramp-overlay/on-ramp-overlay';

export const WalletOverlay = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const shouldShowNewsletterModal = useShouldShowNewsletterModalSelector();
  const prevShouldShowNewsletterModalRef = useRef(shouldShowNewsletterModal);

  useEffect(() => {
    if (prevShouldShowNewsletterModalRef.current && !shouldShowNewsletterModal) {
      dispatch(setStartModalAllowedAction(true));
    }
    prevShouldShowNewsletterModalRef.current = shouldShowNewsletterModal;
  }, [dispatch, shouldShowNewsletterModal]);

  return (
    <>
      <OnRampOverlay />
      {isFocused && !isAnyBackupMade && <BackupYourWalletOverlay />}
    </>
  );
};
