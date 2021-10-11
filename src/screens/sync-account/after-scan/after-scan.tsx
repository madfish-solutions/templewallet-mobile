import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
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
    setPassword(password);
    setUseBiometry(useBiometry);

    parseSyncPayload(payload, password)
      .then(res => {
        setSeedPhrase(res.mnemonic);
        setHdAccountsLength(res.hdAccountsLength);
      })
      .catch(error => console.log(error));

    if (usePrevPassword) {
      setInnerScreenIndex(1);
    } else {
      setInnerScreenIndex(2);
    }
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
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
      {innerScreenIndex === 2 && (
        <CreateNewPassword
          seedPhrase={seedPhrase}
          password={password}
          useBiometry={useBiometry}
          hdAccountsLength={hdAccountsLength}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
    </>
  );
};
