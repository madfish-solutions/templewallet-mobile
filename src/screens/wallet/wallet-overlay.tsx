import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useShouldShowNewsletterModalSelector } from 'src/store/newsletter/newsletter-selectors';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useIsAnyBackupMadeSelector, useOnRampOverlayStateSelector } from 'src/store/settings/settings-selectors';

import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { OnRampOverlay } from './on-ramp-overlay/on-ramp-overlay';

export const WalletOverlay = memo(() => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const [newsletterModalWasClosed, setNewsletterModalWasClosed] = useState(false);
  const onRampOverlayState = useOnRampOverlayStateSelector();
  const shouldShowNewsletterModal = useShouldShowNewsletterModalSelector();
  const prevShouldShowNewsletterModalRef = useRef(shouldShowNewsletterModal);

  useEffect(() => {
    if (prevShouldShowNewsletterModalRef.current && !shouldShowNewsletterModal) {
      setNewsletterModalWasClosed(true);
    }
    prevShouldShowNewsletterModalRef.current = shouldShowNewsletterModal;
  }, [dispatch, shouldShowNewsletterModal]);

  const handleCancel = useCallback(() => {
    dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
    setNewsletterModalWasClosed(false);
  }, [dispatch]);

  if (!isFocused) {
    return null;
  }

  if (!isAnyBackupMade) {
    return <BackupYourWalletOverlay />;
  }

  // Bottom sheets should be rendered for some time before opening to open properly
  return onRampOverlayState === OnRampOverlayState.Continue ||
    (onRampOverlayState === OnRampOverlayState.Start && newsletterModalWasClosed) ? (
    <OnRampOverlay isStart={onRampOverlayState === OnRampOverlayState.Start} onClose={handleCancel} isOpen />
  ) : null;
});
