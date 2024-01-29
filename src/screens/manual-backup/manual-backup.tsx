import React, { memo, useCallback, useState } from 'react';

import { RevealSeedPhrase } from 'src/layouts/reveal-seed-phrase';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { VerifySeedPhrase } from './verify-seed-phrase/verify-seed-phrase';

export const ManualBackup = memo(() => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);
  const { goBack: navigateBack } = useNavigation();

  usePageAnalytic(ScreensEnum.ManualBackup);

  const goBack = useCallback(() => {
    if (innerScreenIndex === 0) {
      navigateBack();

      return;
    }

    setInnerScreenIndex(innerScreenIndex - 1);
  }, [innerScreenIndex, setInnerScreenIndex, navigateBack]);

  const onRevealSeedPhraseSubmit = useCallback(() => setInnerScreenIndex(1), [setInnerScreenIndex]);

  return (
    <>
      {innerScreenIndex === 0 && <RevealSeedPhrase onGoBackPress={goBack} onSubmit={onRevealSeedPhraseSubmit} />}
      {innerScreenIndex === 1 && <VerifySeedPhrase onGoBackPress={goBack} />}
    </>
  );
});
