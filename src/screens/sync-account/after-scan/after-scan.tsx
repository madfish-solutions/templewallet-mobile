import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { showErrorToast } from '../../../toast/toast.utils';
import { parseSyncPayload } from '../../../utils/sync.utils';
import { ConfirmSync } from './confirm-sync/confirm-sync';
import { ConfirmSyncFormValues } from './confirm-sync/confirm-sync.form';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { WalletImported } from './wallet-imported/wallet-imported';

export const AfterSyncQRScan = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [useBiometry, setUseBiometry] = useState<boolean | undefined>(undefined);
  const [hdAccountsLength, setHdAccountsLength] = useState(0);
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const { payload } = useRoute<RouteProp<ScreensParamList, ScreensEnum.ConfirmSync>>().params;
  const handleConfirmSyncFormSubmit = ({ usePrevPassword, password, useBiometry }: ConfirmSyncFormValues) => {
    parseSyncPayload(payload, password)
      .then(res => {
        setSeedPhrase(res.mnemonic);
        setPassword(password);
        setUseBiometry(useBiometry);
        setHdAccountsLength(res.hdAccountsLength);

        if (usePrevPassword) {
          setInnerScreenIndex(1);
        } else {
          setInnerScreenIndex(2);
        }
      })
      .catch(e => showErrorToast({ description: e.message }));
  };

  return (
    <>
      {innerScreenIndex === 0 && <ConfirmSync onSubmit={handleConfirmSyncFormSubmit} />}
      {innerScreenIndex === 1 && (
        <WalletImported
          seedPhrase={seedPhrase}
          password={password}
          useBiometry={useBiometry}
          hdAccountsLength={hdAccountsLength}
        />
      )}
      {innerScreenIndex === 2 && (
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
