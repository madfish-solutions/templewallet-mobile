import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter, from, switchMap, tap } from 'rxjs';

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
import { useTrackCloudError } from 'src/utils/cloud-backup/use-track-cloud-error';
import { isTruthy } from 'src/utils/is-truthy';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

import { BackupNotFound } from './backup-not-found';
import { RestoreFromCloud } from './restore-from-backup';

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.ContinueWithCloud);

  const { navigate, goBack } = useNavigation();
  const dispatch = useDispatch();
  const trackCloudError = useTrackCloudError();

  const [encryptedBackup, setEncryptedBackup] = useState<EncryptedBackupObject>();

  const initialLoad$ = useSubjectWithReSubscription$<void>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(() => from(requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true)))),
        filter(isLoggedIn => {
          if (!isLoggedIn) {
            dispatch(hideLoaderAction());
            goBack();
          }

          return isLoggedIn;
        }),
        switchMap(() => from(fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true)))),
        tap(backup => {
          dispatch(hideLoaderAction());

          if (isTruthy(backup)) {
            setEncryptedBackup(backup);
          }
        })
      ),
    error => {
      goBack();
      dispatch(hideLoaderAction());
      showErrorToastByError(error);

      trackCloudError(error);
    },
    [dispatch, navigate, goBack, trackCloudError]
  );

  const retryBackupLoad$ = useSubjectWithReSubscription$<void>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(() => from(fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true)))),
        tap(backup => {
          dispatch(hideLoaderAction());

          if (isTruthy(backup)) {
            setEncryptedBackup(backup);
          }
        })
      ),
    error => {
      dispatch(hideLoaderAction());
      showErrorToastByError(error);

      trackCloudError(error);
    },
    [dispatch, navigate, trackCloudError]
  );

  useEffect(() => void initialLoad$.next(), []);

  if (encryptedBackup) {
    return <RestoreFromCloud encryptedBackup={encryptedBackup} />;
  }

  return <BackupNotFound retry={() => retryBackupLoad$.next()} />;
};
