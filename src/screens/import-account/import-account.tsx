import React, { useState } from 'react';

import { useBiometryAvailability } from '../../hooks/use-biometry-availability.hook';
import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { useShelter } from '../../shelter/use-shelter.hook';
import { isDefined } from '../../utils/is-defined';
import { EnableBiometry } from '../create-account/enable-biometry/enable-biometry';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { CreateNewPasswordFormValues } from './create-new-password/create-new-password.form';
import { ImportWallet } from './import-wallet/import-wallet';
import { ImportWalletFormValues } from './import-wallet/import-wallet.form';

export const ImportAccount = () => {
  const { availableBiometryType } = useBiometryAvailability();
  const biometryAvailable = isDefined(availableBiometryType);
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(biometryAvailable ? 3 : 2);
  const { importWallet } = useShelter();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');

  const handleImportWalletFormSubmit = ({ seedPhrase: newSeedPhrase }: ImportWalletFormValues) => {
    setSeedPhrase(newSeedPhrase);
    setInnerScreenIndex(1);
  };
  const handlePasswordFormSubmit = ({ password }: CreateNewPasswordFormValues) => {
    setPassword(password);
    if (biometryAvailable) {
      setInnerScreenIndex(2);
    } else {
      importWallet(seedPhrase, password);
    }
  };

  return (
    <>
      {innerScreenIndex === 0 && <ImportWallet onSubmit={handleImportWalletFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword onGoBackPress={() => setInnerScreenIndex(0)} onSubmit={handlePasswordFormSubmit} />
      )}
      {innerScreenIndex === 2 && <EnableBiometry seedPhrase={seedPhrase} password={password} />}
    </>
  );
};
