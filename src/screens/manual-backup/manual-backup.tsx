import React, { memo, useCallback } from 'react';

import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { RevealSeedPhrase } from 'src/layouts/reveal-seed-phrase';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { VerifySeedPhrase } from './verify-seed-phrase/verify-seed-phrase';

export const ManualBackup = memo(() => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);

  usePageAnalytic(ScreensEnum.ManualBackup);

  const onRevealSeedPhraseSubmit = useCallback(() => setInnerScreenIndex(1), [setInnerScreenIndex]);
  const goToRevealSeedPhrase = useCallback(() => setInnerScreenIndex(0), [setInnerScreenIndex]);

  return (
    <>
      {innerScreenIndex === 0 && <RevealSeedPhrase onSubmit={onRevealSeedPhraseSubmit} />}
      {innerScreenIndex === 1 && <VerifySeedPhrase onGoBackPress={goToRevealSeedPhrase} />}
    </>
  );
});
