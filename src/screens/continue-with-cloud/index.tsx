import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { EncryptedBackupObject, fetchCloudBackup } from 'src/utils/cloud-backup';
import { useCloudAnalytics } from 'src/utils/cloud-backup/use-cloud-analytics';
import { isTruthy } from 'src/utils/is-truthy';

import { BackupNotFound } from './backup-not-found';
import { RestoreFromCloud } from './restore-from-backup';

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.ContinueWithCloud);

  const { backup: initialEncryptedBackup, error } = useScreenParams<ScreensEnum.ContinueWithCloud>();
  const dispatch = useDispatch();
  const { trackCloudError, trackCloudSuccess } = useCloudAnalytics();

  const [encryptedBackup, setEncryptedBackup] = useState<EncryptedBackupObject | undefined>(initialEncryptedBackup);

  useEffect(() => {
    if (isTruthy(initialEncryptedBackup)) {
      trackCloudSuccess('Backup retrieval');
    } else if (isTruthy(error)) {
      showErrorToastByError(error);
      trackCloudError(error);
    }
  }, [error, initialEncryptedBackup, trackCloudError, trackCloudSuccess]);

  const retryBackupLoad = useCallback(async () => {
    try {
      dispatch(showLoaderAction());

      const backup = await fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true));

      dispatch(hideLoaderAction());

      if (isTruthy(backup)) {
        setEncryptedBackup(backup);
      }

      trackCloudSuccess('Backup retrieval retry');
    } catch (err) {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);

      trackCloudError(err);
    }
  }, [dispatch, trackCloudError, trackCloudSuccess]);

  if (encryptedBackup) {
    return <RestoreFromCloud encryptedBackup={encryptedBackup} />;
  }

  return <BackupNotFound retry={retryBackupLoad} />;
};
