import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { enterPassword } from '../../../store/security/security-actions';
import { showErrorToast } from '../../../toast/toast.utils';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { parseSyncPayload } from '../../../utils/sync.utils';
import { ConfirmSync } from './confirm-sync/confirm-sync';
import { ConfirmSyncFormValues } from './confirm-sync/confirm-sync.form';
import { CreateNewPassword } from './create-new-password/create-new-password';

export const AfterSyncQRScan = () => {
  const { importWallet } = useShelter();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [useBiometry, setUseBiometry] = useState(false);
  const [hdAccountsLength, setHdAccountsLength] = useState(0);
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const { payload } = useRoute<RouteProp<ScreensParamList, ScreensEnum.ConfirmSync>>().params;
  const dispatch = useDispatch();
  const { pageEvent } = useAnalytics();
  useEffect(() => void pageEvent(ScreensEnum.ConfirmSync, ''), []);

  const handleConfirmSyncFormSubmit = ({
    usePrevPassword,
    password,
    useBiometry: useBiometryValue
  }: ConfirmSyncFormValues) => {
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
      });
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
};
