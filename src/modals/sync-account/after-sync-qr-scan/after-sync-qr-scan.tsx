import { RouteProp, useRoute } from '@react-navigation/core';
import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { enterPassword } from 'src/store/security/security-actions';
import {
  hideLoaderAction,
  setAdsBannerVisibilityAction,
  setIsAnalyticsEnabled,
  showLoaderAction
} from 'src/store/settings/settings-actions';
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

  const { payload } = useRoute<RouteProp<ModalsParamList, ModalsEnum.ConfirmSync>>().params;
  usePageAnalytic(ModalsEnum.ConfirmSync);

  const handleConfirmSyncFormSubmit = ({
    usePrevPassword,
    password,
    analytics,
    viewAds,
    useBiometry: useBiometryValue
  }: ConfirmSyncFormValues) => {
    if (viewAds) {
      dispatch(togglePartnersPromotionAction(true));
      dispatch(setAdsBannerVisibilityAction(false));
    }
    dispatch(setIsAnalyticsEnabled(analytics));
    dispatch(showLoaderAction());

    parseSyncPayload(payload, password)
      .then(res => {
        setUseBiometry(useBiometryValue === true);
        setSeedPhrase(res.mnemonic);
        setHdAccountsLength(res.hdAccountsLength);

        if (usePrevPassword === true) {
          dispatch(enterPassword.success());
          importWallet({
            seedPhrase: res.mnemonic,
            password,
            useBiometry: useBiometryValue,
            hdAccountsLength: res.hdAccountsLength
          });
        } else {
          setInnerScreenIndex(1);
        }
      })
      .catch(e => {
        dispatch(enterPassword.fail());

        return showErrorToast({ description: e.message });
      })
      .finally(() => void dispatch(hideLoaderAction()));
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
