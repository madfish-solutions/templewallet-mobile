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

  const [seedPhrase, setSeedPhrase] = useState('');

  usePageAnalytic(ScreensEnum.BackupSettings);

  const handleBackupManually = () =>
    void revealSeedPhrase({
      successCallback: value => {
        setSeedPhrase(value);
        setInnerScreenIndex(1);
      }
    });

  const handleVerify = () => {
    dispatch(verifySeedPhrase(true));
    goBack();
  };

  const handleSubmit = () => setInnerScreenIndex(2);
  const handleBack = () => setInnerScreenIndex(1);

  return (
    <>
      {innerScreenIndex === 0 && <Backup onPress={handleBackupManually} />}
      {innerScreenIndex === 1 && <BackupSeed initialSeedPhrase={seedPhrase} onSubmit={handleSubmit} />}
      {innerScreenIndex === 2 && (
        <BackupVerify seedPhrase={seedPhrase} onVerify={handleVerify} onGoBackPress={handleBack} />
      )}
    </>
  );
};
