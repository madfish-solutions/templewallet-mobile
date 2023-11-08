import React, { memo, useCallback } from 'react';

import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { useDoMigrations } from 'src/hooks/use-do-migrations.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { RevealSeedPhrase } from 'src/layouts/reveal-seed-phrase';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { SecurityUpdateInfo } from './security-update-info';

export const SecurityUpdate = memo(() => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);
  useNavigationSetOptions({ headerLeft: () => null }, []);
  const { goBack } = useNavigation();

  const doMigration = useDoMigrations(goBack);

  usePageAnalytic(ScreensEnum.SecurityUpdate);

  const goToSeedPhraseVerification = useCallback(() => setInnerScreenIndex(1), [setInnerScreenIndex]);

  return (
    <>
      <ModalStatusBar />
      {innerScreenIndex === 0 && <SecurityUpdateInfo onNextClick={goToSeedPhraseVerification} />}
      {innerScreenIndex === 1 && (
        <RevealSeedPhrase
          onSubmit={doMigration}
          submitButtonTitle="Update"
          seedPhraseBackupErrorText="Unable to continue without accepting Seed Phrase backup"
          headerTitleText="Backup"
        />
      )}
    </>
  );
});
