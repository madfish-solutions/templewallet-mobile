import React from 'react';

import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { RevealSeedPhrase } from 'src/layouts/reveal-seed-phrase';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

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
