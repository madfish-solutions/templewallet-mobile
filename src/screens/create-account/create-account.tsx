import React, { useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { CreateNewWallet } from './create-new-wallet/create-new-wallet';
import { CreateNewWalletFormValues } from './create-new-wallet/create-new-wallet.form';

export const CreateAccount = () => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);
  const [seedPhrase, setSeedPhrase] = useState('');

  useNavigationSetOptions(
    {
      headerRight: () => <HeaderProgress current={innerScreenIndex + 1} total={2} />
    },
    [innerScreenIndex]
  );

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
