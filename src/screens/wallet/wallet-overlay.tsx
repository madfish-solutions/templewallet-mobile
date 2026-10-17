import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useNewsletterModalWasClosedSelector } from 'src/store/newsletter/newsletter-selectors';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useIsAnyBackupMadeSelector, useOnRampOverlayStateSelector } from 'src/store/settings/settings-selectors';

import { BackupYourWalletOverlay } from './backup-your-wallet-overlay/backup-your-wallet-overlay';
import { OnRampOverlay } from './on-ramp-overlay/on-ramp-overlay';

export const WalletOverlay = memo(() => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const onRampOverlayState = useOnRampOverlayStateSelector();
  const newsletterModalWasClosed = useNewsletterModalWasClosedSelector();

  const handleCancel = useCallback(() => {
    dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
  }, [dispatch]);

  if (!isFocused) {
    return null;
  }

  if (!isAnyBackupMade) {
    return <BackupYourWalletOverlay />;
  }

  return onRampOverlayState === OnRampOverlayState.Continue ||
    (onRampOverlayState === OnRampOverlayState.Start && newsletterModalWasClosed) ? (
    <OnRampOverlay isStart={onRampOverlayState === OnRampOverlayState.Start} onClose={handleCancel} isOpen />
  ) : null;
});
