import { useDispatch } from 'react-redux';
import { filter, from, map, switchMap, tap } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, madeCloudBackupAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { showSuccessToast, catchThrowToastError, ToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import {
  FAILED_TO_LOGIN_ERR_TITLE,
  cloudTitle,
  doesCloudBackupExist,
  requestSignInToCloud,
  saveCloudBackup
} from 'src/utils/cloud-backup';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

import { alertOnExistingBackup } from './utils';

interface EnterCloudPasswordFormValues {
  password: string;
}

export const EnterCloudPasswordValidationSchema: SchemaOf<EnterCloudPasswordFormValues> = object().shape({
  password: passwordValidation
});

export const EnterCloudPasswordInitialValues: EnterCloudPasswordFormValues = {
  password: ''
};

export const useHandleSubmit = () => {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const proceedWithSaving$ = useSubjectWithReSubscription$<string>(
    subject$ =>
      subject$.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(password =>
          Shelter.revealSeedPhrase$().pipe(
            switchMap(mnemonic =>
              from(saveCloudBackup(mnemonic, password).catch(catchThrowToastError('Failed to back up to cloud', true)))
            )
          )
        ),
        tap(() => {
          dispatch(hideLoaderAction());
          dispatch(madeCloudBackupAction());
          showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
          goBack();
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);

      const errorTitle = err instanceof ToastError ? err.title : undefined;
      trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
    },
    [dispatch, goBack, trackEvent]
  );

  const submit$ = useSubjectWithReSubscription$<string>(
    subject$ =>
      subject$.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(password =>
          ensurePasswordIsCorrect$(password).pipe(
            switchMap(() => from(requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true)))),
            filter(isLoggedIn => {
              if (!isLoggedIn) {
                dispatch(hideLoaderAction());
              }

              return isLoggedIn;
            }),
            switchMap(() =>
              from(doesCloudBackupExist().catch(catchThrowToastError('Failed to read from cloud', true)))
            ),
            map(backupExists => ({ backupExists, password }))
          )
        ),
        tap(({ backupExists, password }) => {
          if (backupExists) {
            dispatch(hideLoaderAction());

            return void alertOnExistingBackup(
              () => void subject$.next(password),
              () => void proceedWithSaving$.next(password),
              () => void navigate(ScreensEnum.ManualBackup)
            );
          }

          return void proceedWithSaving$.next(password);
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);

      const errorTitle = err instanceof ToastError ? err.title : undefined;
      trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
    },
    [dispatch, navigate, trackEvent]
  );

  return ({ password }: EnterCloudPasswordFormValues) => void submit$.next(password);
};

const ensurePasswordIsCorrect$ = (password: string) =>
  Shelter.isPasswordCorrect$(password).pipe(
    map(isPasswordCorrect => {
      if (!isPasswordCorrect) {
        throw new ToastError('Wrong password');
      }
    })
  );
