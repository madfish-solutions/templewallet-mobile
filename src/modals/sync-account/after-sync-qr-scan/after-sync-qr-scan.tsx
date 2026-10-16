import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { enterPassword } from 'src/store/security/security-actions';
import { hideLoaderAction, setIsAnalyticsEnabled, showLoaderAction } from 'src/store/settings/settings-actions';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { parseSyncPayload } from 'src/utils/sync.utils';

import { ConfirmSync } from './confirm-sync/confirm-sync';
import { ConfirmSyncFormValues } from './confirm-sync/confirm-sync.form';
import { CreateNewPassword } from './create-new-password/create-new-password';

export const AfterSyncQRScan = memo(() => {
  const dispatch = useDispatch();
  const { importWallet } = useShelter();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [useBiometry, setUseBiometry] = useState(false);
  const [hdAccountsLength, setHdAccountsLength] = useState(0);
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const { payload } = useModalParams<ModalsEnum.ConfirmSync>();
  usePageAnalytic(ModalsEnum.ConfirmSync);

  const handleConfirmSyncFormSubmit = async ({
    usePrevPassword,
    password,
    analytics,
    viewAds,
    useBiometry: useBiometryValue
  }: ConfirmSyncFormValues) => {
    dispatch(togglePartnersPromotionAction(viewAds));
    dispatch(setIsAnalyticsEnabled(analytics));
    dispatch(showLoaderAction());

    let syncPayload: Awaited<ReturnType<typeof parseSyncPayload>>;

    try {
      syncPayload = await parseSyncPayload(payload, password);
    } catch (error) {
      dispatch(enterPassword.fail());
      dispatch(hideLoaderAction());
      showErrorToast({ description: error instanceof Error ? error.message : 'Failed to parse sync payload' });

      return;
    }

    setUseBiometry(useBiometryValue === true);
    setSeedPhrase(syncPayload.mnemonic);
    setHdAccountsLength(syncPayload.hdAccountsLength);

    if (usePrevPassword !== true) {
      setInnerScreenIndex(1);
      dispatch(hideLoaderAction());

      return;
    }

    dispatch(enterPassword.success());

    try {
      await importWallet({
        seedPhrase: syncPayload.mnemonic,
        password,
        useBiometry: useBiometryValue,
        hdAccountsLength: syncPayload.hdAccountsLength
      });
    } catch (error) {
      showErrorToast({ description: error instanceof Error ? error.message : 'Failed to import wallet' });
    }
  };

  return (
    <>
      {innerScreenIndex === 0 && <ConfirmSync onSubmit={handleConfirmSyncFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword
          seedPhrase={seedPhrase}
          useBiometry={useBiometry}
          hdAccountsLength={hdAccountsLength}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
    </>
  );
});
