import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { showErrorToast } from '../../../toast/toast.utils';
import { parseSyncPayload } from '../../../utils/sync.utils';
import { ConfirmSync } from './confirm-sync/confirm-sync';
import { ConfirmSyncFormValues } from './confirm-sync/confirm-sync.form';
import { CreateNewPassword } from './create-new-password/create-new-password';

export const AfterSyncQRScan = () => {
  const { importWallet } = useShelter();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [useBiometry, setUseBiometry] = useState<boolean | undefined>(undefined);
  const [hdAccountsLength, setHdAccountsLength] = useState(0);
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const { payload } = useRoute<RouteProp<ScreensParamList, ScreensEnum.ConfirmSync>>().params;
  const handleConfirmSyncFormSubmit = ({ usePrevPassword, password, useBiometry }: ConfirmSyncFormValues) => {
    parseSyncPayload(payload, password)
      .then(res => {
        setSeedPhrase(res.mnemonic);
        setUseBiometry(useBiometry);
        setHdAccountsLength(res.hdAccountsLength);

        if (usePrevPassword) {
          console.log('import');
          importWallet({ seedPhrase, password, useBiometry, hdAccountsLength });
        } else {
          setInnerScreenIndex(1);
        }
      })
      .catch(e => showErrorToast({ description: e.message }));
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
