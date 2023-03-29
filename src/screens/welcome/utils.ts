import { useDispatch } from 'react-redux';
import { filter, from, map, switchMap, tap } from 'rxjs';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { buildPipeErrorToaster, catchThrowToastError } from 'src/toast/toast.utils';
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
              map(backupFile => {
                if (backupFile) {
                  navigate(ScreensEnum.RestoreFromCloud, { fileId: backupFile.id });
                } else {
                  navigate(ScreensEnum.CreateAccount, { backupToCloud: true });
                }
              }),
              buildPipeErrorToaster()
            )
          ),
          tap(() => dispatch(hideLoaderAction()))
        )
        .subscribe(),
    [dispatch, navigate]
  );

  return () => void continueWithCloud$.next();
};
