import React, { FC, useState } from 'react';

import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { formatSize } from '../../../styles/format-size';
import { ImportWalletFromKeystoreFile } from './import-wallet-from-keystore-file/import-wallet-from-keystore-file';
import { ImportWalletFromSeedPhrase } from './import-wallet-from-seed-phrase/import-wallet-from-seed-phrase';

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
