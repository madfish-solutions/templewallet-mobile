import React, { useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { ImportWallet } from './import-wallet/import-wallet';
import { ImportWalletFormValues } from './import-wallet/import-wallet.form';

export const ImportAccount = () => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);
  const [seedPhrase, setSeedPhrase] = useState('');

  useNavigationSetOptions(
    {
      headerRight: () => <HeaderProgress current={innerScreenIndex + 1} total={2} />
    },
    [innerScreenIndex]
  );

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
