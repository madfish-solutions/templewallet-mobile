import React, { memo, useCallback, useState } from 'react';

import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';

import { CreateNewPassword } from './create-new-password/create-new-password';
import { ImportWalletFromKeystoreFile } from './import-wallet-from-keystore-file-form/import-wallet-from-keystore-file';
import { ImportWalletFromSeedPhrase } from './import-wallet-from-seed-phrase-form/import-wallet-from-seed-phrase';
import { ImportWalletCredentials } from './interfaces';

interface Props {
  fromSeed?: boolean;
  onBackPress: EmptyFn;
}

export const ImportWallet = memo<Props>(({ fromSeed = true, onBackPress }) => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2, true);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [initialPassword, setInitialPassword] = useState<string>();

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
          <ImportWalletFromSeedPhrase onSubmit={handleImportWalletFormSubmit} onBackPress={onBackPress} />
        ) : (
          <ImportWalletFromKeystoreFile onSubmit={handleImportWalletFormSubmit} onBackPress={onBackPress} />
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
