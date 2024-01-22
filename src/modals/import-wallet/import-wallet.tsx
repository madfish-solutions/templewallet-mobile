import React, { memo, useCallback, useState } from 'react';

import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { CreateNewPassword } from './create-new-password/create-new-password';
import { ImportWalletFromKeystoreFile } from './import-wallet-from-keystore-file-form/import-wallet-from-keystore-file';
import { ImportWalletFromSeedPhrase } from './import-wallet-from-seed-phrase-form/import-wallet-from-seed-phrase';
import { ImportWalletCredentials } from './interfaces';

interface Props {
  fromSeed?: boolean;
}

export const ImportWallet = memo<Props>(({ fromSeed = true }) => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2, true);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [initialPassword, setInitialPassword] = useState<string>();

  usePageAnalytic(fromSeed ? ModalsEnum.ImportWalletFromSeedPhrase : ModalsEnum.ImportWalletFromKeystoreFile);

  const handleImportWalletFormSubmit = useCallback(
    ({ seedPhrase: newSeedPhrase, password }: ImportWalletCredentials) => {
      setSeedPhrase(newSeedPhrase);
      setInitialPassword(password);
      setInnerScreenIndex(1);
    },
    []
  );

  return (
    <>
      {innerScreenIndex === 0 &&
        (fromSeed ? (
          <ImportWalletFromSeedPhrase onSubmit={handleImportWalletFormSubmit} />
        ) : (
          <ImportWalletFromKeystoreFile onSubmit={handleImportWalletFormSubmit} />
        ))}
      {innerScreenIndex === 1 && (
        <CreateNewPassword
          initialPassword={initialPassword}
          seedPhrase={seedPhrase}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
    </>
  );
});
