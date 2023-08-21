import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import {
  EncryptedBackupObject,
  FAILED_TO_LOGIN_ERR_TITLE,
  fetchCloudBackup,
  requestSignInToCloud
} from 'src/utils/cloud-backup';
import { useCloudResponseHandler } from 'src/utils/cloud-backup/use-track-cloud-error';
import { isTruthy } from 'src/utils/is-truthy';

import { BackupNotFound } from './backup-not-found';
import { RestoreFromCloud } from './restore-from-backup';

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.ContinueWithCloud);

  const { navigate, goBack } = useNavigation();
  const dispatch = useDispatch();
  const { trackCloudError, trackCloudSuccess } = useCloudResponseHandler();

  const [encryptedBackup, setEncryptedBackup] = useState<EncryptedBackupObject>();

  const initialLoad = useCallback(async () => {
    try {
      dispatch(showLoaderAction());

      const isLoggedIn = await requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true));

      if (!isLoggedIn) {
        dispatch(hideLoaderAction());
        goBack();

        return;
      }

      const backup = await fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true));

      dispatch(hideLoaderAction());

      if (isTruthy(backup)) {
        setEncryptedBackup(backup);
      }

      trackCloudSuccess('Backup retrieval');
    } catch (error) {
      goBack();
      dispatch(hideLoaderAction());
      showErrorToastByError(error);

      trackCloudError(error);
    }
  }, [dispatch, trackCloudSuccess, trackCloudError]);

  const retryBackupLoad = useCallback(async () => {
    try {
      dispatch(showLoaderAction());

      const backup = await fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true));

      dispatch(hideLoaderAction());

      if (isTruthy(backup)) {
        setEncryptedBackup(backup);
      }

      trackCloudSuccess('Backup retrieval retry');
    } catch (error) {
      dispatch(hideLoaderAction());
      showErrorToastByError(error);

      trackCloudError(error);
    }
  }, [dispatch, navigate, trackCloudError, trackCloudSuccess]);

  useEffect(() => void initialLoad(), []);

  if (encryptedBackup) {
    return <RestoreFromCloud encryptedBackup={encryptedBackup} />;
  }

  return <BackupNotFound retry={retryBackupLoad} />;
};
