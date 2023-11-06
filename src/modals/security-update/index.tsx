import React, { memo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { HeaderButton } from 'src/components/header/header-button/header-button';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { RevealSeedPhrase } from 'src/layouts/reveal-seed-phrase';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { setShouldMigrateOnRestartAction } from 'src/store/wallet/wallet-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { SecurityUpdateInfo } from './security-update-info';

export const SecurityUpdate = memo(() => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2, 'headerLeft');
  const dispatch = useDispatch();

  usePageAnalytic(ModalsEnum.SecurityUpdate);

  const goToSeedPhraseVerification = useCallback(() => setInnerScreenIndex(1), [setInnerScreenIndex]);

  const handleSeedPhraseVerified = useCallback(() => dispatch(setShouldMigrateOnRestartAction(true)), [dispatch]);

  const handleCloseAttempt = useCallback(
    () =>
      Alert.alert(
        'Please be cautious to avoid losing your funds!',
        'The migration process will automatically initiate upon restarting your wallet. Be sure to back up your seed \
phrase to prevent any loss of your funds.',
        [
          {
            text: 'Close',
            style: 'destructive',
            onPress: handleSeedPhraseVerified
          },
          {
            text: 'Back'
          }
        ]
      ),
    [handleSeedPhraseVerified]
  );

  useNavigationSetOptions(
    { headerRight: () => <HeaderButton iconName={IconNameEnum.Close} onPress={handleCloseAttempt} /> },
    [handleCloseAttempt]
  );

  return (
    <>
      <ModalStatusBar />
      {innerScreenIndex === 0 && <SecurityUpdateInfo onNextClick={goToSeedPhraseVerification} />}
      {innerScreenIndex === 1 && (
        <RevealSeedPhrase
          onSubmit={handleSeedPhraseVerified}
          submitButtonTitle="Update"
          seedPhraseBackupErrorText="Unable to continue without accepting Seed Phrase backup"
          headerTitleText="Backup"
        />
      )}
    </>
  );
});
