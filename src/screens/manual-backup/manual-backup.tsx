import React from 'react';

import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { RevealSeedPhrase } from './reveal-seed-phrase/reveal-seed-phrase';
import { VerifySeedPhrase } from './verify-seed-phrase/verify-seed-phrase';

export const ManualBackup = () => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);

  usePageAnalytic(ScreensEnum.ManualBackup);

  return (
    <>
      {innerScreenIndex === 0 && <RevealSeedPhrase onSubmit={() => setInnerScreenIndex(1)} />}
      {innerScreenIndex === 1 && <VerifySeedPhrase onGoBackPress={() => setInnerScreenIndex(0)} />}
    </>
  );
};
