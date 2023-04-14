import { useDispatch } from 'react-redux';
import { filter, from, switchMap, tap } from 'rxjs';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { FAILED_TO_LOGIN_ERR_TITLE, fetchCloudBackupDetails, requestSignInToCloud } from 'src/utils/cloud-backup';
import { isTruthy } from 'src/utils/is-truthy';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

export const useOnContinueWithCloudButtonPress = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const continueWithCloud$ = useSubjectWithReSubscription$<void>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(() => from(requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true)))),
        filter(isLoggedIn => {
          if (!isLoggedIn) {
            dispatch(hideLoaderAction());
          }

          return isLoggedIn;
        }),
        switchMap(() => from(fetchCloudBackupDetails().catch(catchThrowToastError('Failed to read from cloud', true)))),
        tap(backupFile => {
          dispatch(hideLoaderAction());

          if (isTruthy(backupFile)) {
            navigate(ScreensEnum.RestoreFromCloud);
          } else {
            navigate(ScreensEnum.CreateAccount, { backupToCloud: true });
          }
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);
    },
    [dispatch, navigate]
  );

  return () => void continueWithCloud$.next();
};
