import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter, from, switchMap, tap } from 'rxjs';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { ToastError, catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { usePageAnalytic, useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import {
  EncryptedBackupObject,
  FAILED_TO_LOGIN_ERR_TITLE,
  cloudTitle,
  fetchCloudBackup,
  requestSignInToCloud
} from 'src/utils/cloud-backup';
import { isTruthy } from 'src/utils/is-truthy';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

import { BackupNotFound } from './backup-not-found';
import { RestoreFromCloud } from './restore-from-backup';

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.ContinueWithCloud);

  const { navigate, goBack } = useNavigation();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const [encryptedBackup, setEncryptedBackup] = useState<EncryptedBackupObject>();

  const continueWithCloud$ = useSubjectWithReSubscription$<void>(
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

      const errorTitle = error instanceof ToastError ? error.title : undefined;
      trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
    },
    [dispatch, navigate, goBack, trackEvent]
  );

  const retry$ = useSubjectWithReSubscription$<void>(
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

      const errorTitle = error instanceof ToastError ? error.title : undefined;
      trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
    },
    [dispatch, navigate, trackEvent]
  );

  useEffect(() => void continueWithCloud$.next(), []);

  if (encryptedBackup) {
    return <RestoreFromCloud encryptedBackup={encryptedBackup} />;
  }

  return <BackupNotFound retry={() => retry$.next()} />;
};
