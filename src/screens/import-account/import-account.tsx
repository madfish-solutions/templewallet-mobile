import React, { useState } from 'react';

import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { ImportWallet, ImportWalletCredentials } from './import-wallet/import-wallet';

export const ImportAccount = () => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [initialPassword, setInitialPassword] = useState<string>();

  usePageAnalytic(ScreensEnum.ImportAccount);

  const handleImportWalletFormSubmit = ({ seedPhrase: newSeedPhrase, password }: ImportWalletCredentials) => {
    setSeedPhrase(newSeedPhrase);
    setInitialPassword(password);
    setInnerScreenIndex(1);
  };

  return (
    <>
      {innerScreenIndex === 0 && <ImportWallet onSubmit={handleImportWalletFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword
          initialPassword={initialPassword}
          seedPhrase={seedPhrase}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
    </>
  );
};
