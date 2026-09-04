import React from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useHDAccounts } from 'src/store/wallet/wallet-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RevealSeedPhraseContent } from './reveal-seed-phrase-content';

export const RevealSeedPhraseModal = () => {
  const hdAccounts = useHDAccounts();

  usePageAnalytic(ModalsEnum.RevealSeedPhrase);

  return <RevealSeedPhraseContent account={hdAccounts[0]} />;
};
