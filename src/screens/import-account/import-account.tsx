import React, { useState } from 'react';

import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { ImportWallet } from './import-wallet/import-wallet';
import { ImportWalletFormValues } from './import-wallet/import-wallet.form';

export const ImportAccount = () => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);
  const [seedPhrase, setSeedPhrase] = useState('');

  const handleImportWalletFormSubmit = ({ seedPhrase: newSeedPhrase }: ImportWalletFormValues) => {
    setSeedPhrase(newSeedPhrase);
    setInnerScreenIndex(1);
  };

  return (
    <>
      {innerScreenIndex === 0 && <ImportWallet onSubmit={handleImportWalletFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword seedPhrase={seedPhrase} onGoBackPress={() => setInnerScreenIndex(0)} />
      )}
    </>
  );
};
