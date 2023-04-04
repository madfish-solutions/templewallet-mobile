import { useDispatch } from 'react-redux';
import { filter, from, switchMap, tap } from 'rxjs';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud } from 'src/utils/cloud-backup';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

export const useOnContinueWithCloudButtonPress = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const continueWithCloud$ = useSubjectWithReSubscription$<void>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(() => from(requestSignInToCloud().catch(catchThrowToastError('Failed to log-in', true)))),
        filter(isLoggedIn => {
          if (!isLoggedIn) {
            dispatch(hideLoaderAction());
          }

          return isLoggedIn;
        }),
        switchMap(() =>
          from(fetchCloudBackupFileDetails().catch(catchThrowToastError('Failed to read from cloud', true)))
        ),
        tap(backupFile => {
          dispatch(hideLoaderAction());

          if (backupFile) {
            navigate(ScreensEnum.RestoreFromCloud, { fileId: backupFile.id });
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
