import React, { useState } from 'react';

import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { CreateNewWallet } from './create-new-wallet/create-new-wallet';
import { CreateNewWalletFormValues } from './create-new-wallet/create-new-wallet.form';

export const CreateAccount = () => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);
  const [seedPhrase, setSeedPhrase] = useState('');

  const handleImportWalletFormSubmit = ({ seedPhrase: newSeedPhrase }: CreateNewWalletFormValues) => {
    setSeedPhrase(newSeedPhrase);
    setInnerScreenIndex(1);
  };

  return (
    <>
      {innerScreenIndex === 0 && <CreateNewWallet onSubmit={handleImportWalletFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword seedPhrase={seedPhrase} onGoBackPress={() => setInnerScreenIndex(0)} />
      )}
    </>
  );
};
