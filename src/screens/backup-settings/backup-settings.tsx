import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { verifySeedPhrase } from '../../store/security/security-actions';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { BackupSeed } from './backup-seed/backup-seed';
import { BackupVerify } from './backup-verify/backup-verify';
import { Backup } from './backup/backup';

export const BackupSettings = () => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const { revealSeedPhrase } = useShelter();

  const [seedPhrase, setSeedPhrase] = useState<string>('');

  usePageAnalytic(ScreensEnum.BackupSettings);

  const handleBackupManually = () => {
    revealSeedPhrase({
      successCallback: value => {
        setSeedPhrase(value);
        setInnerScreenIndex(1);
      }
    });
  };

  const handleVerify = () => {
    dispatch(verifySeedPhrase(true));
    goBack();
  };

  return (
    <>
      {innerScreenIndex === 0 && <Backup onPress={handleBackupManually} />}
      {innerScreenIndex === 1 && <BackupSeed initialSeedPhrase={seedPhrase} onSubmit={() => setInnerScreenIndex(2)} />}
      {innerScreenIndex === 2 && (
        <BackupVerify seedPhrase={seedPhrase} onVerify={handleVerify} onGoBackPress={() => setInnerScreenIndex(1)} />
      )}
    </>
  );
};
