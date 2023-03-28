import { useDispatch } from 'react-redux';
import { catchError, filter, from, switchMap, tap } from 'rxjs';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { buildErrorToaster$, catchThrowToastError } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud } from 'src/utils/cloud-backup';
import { isTruthy } from 'src/utils/is-truthy';
import { useSubjectSubscription$ } from 'src/utils/rxjs.utils';

export const useOnContinueWithCloudButtonPress = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const continueWithCloud$ = useSubjectSubscription$<void>(
    $subject =>
      $subject
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          switchMap(() =>
            from(requestSignInToCloud().catch(catchThrowToastError('Failed to log-in', true))).pipe(
              filter(isTruthy),
              switchMap(() =>
                from(fetchCloudBackupFileDetails().catch(catchThrowToastError('Failed to read from cloud', true)))
              ),
              catchError(buildErrorToaster$())
            )
          ),
          tap(() => dispatch(hideLoaderAction()))
        )
        .subscribe(backupFile => {
          if (backupFile) {
            return void navigate(ScreensEnum.RestoreFromCloud, { fileId: backupFile.id });
          }

          return void navigate(ScreensEnum.CreateAccount, { backupToCloud: true });
        }),
    [dispatch, navigate]
  );

  return () => void continueWithCloud$.next();
};
