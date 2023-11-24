import React, { FC, useState } from 'react';

import { Divider } from 'src/components/divider/divider';
import { HeaderBackButton } from 'src/components/header/header-back-button/header-back-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { formatSize } from 'src/styles/format-size';

import { ImportWalletFromKeystoreFile } from './import-wallet-from-keystore-file/import-wallet-from-keystore-file';
import { ImportWalletFromSeedPhrase } from './import-wallet-from-seed-phrase/import-wallet-from-seed-phrase';
import { ImportWalletSelectors } from './selectors';

export interface ImportWalletCredentials {
  seedPhrase: string;
  password?: string;
}

export interface ImportWalletProps {
  onSubmit: (formValues: ImportWalletCredentials) => void;
}

const seedPhraseTabIndex = 0;

export const ImportWallet: FC<ImportWalletProps> = ({ onSubmit }) => {
  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showSeedPhraseForm = segmentedControlIndex === seedPhraseTabIndex;

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Import existing Wallet" />
    },
    []
  );

  return (
    <ScreenContainer isFullScreenMode={true}>
      <TextSegmentControl
        selectedIndex={segmentedControlIndex}
        values={['Seed phrase', 'Keystore file']}
        testID={ImportWalletSelectors.FormSwitcher}
        onChange={setSegmentedControlIndex}
      />

      <Divider size={formatSize(32)} />

      {showSeedPhraseForm ? (
        <ImportWalletFromSeedPhrase onSubmit={onSubmit} />
      ) : (
        <ImportWalletFromKeystoreFile onSubmit={onSubmit} />
      )}
    </ScreenContainer>
  );
};
