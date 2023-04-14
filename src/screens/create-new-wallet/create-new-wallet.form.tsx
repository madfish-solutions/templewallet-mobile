import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { from, map, of, switchMap, tap } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from 'src/form/validation/accept-terms';
import { analyticsValidation } from 'src/form/validation/analytics';
import { passwordConfirmationValidation, passwordValidation } from 'src/form/validation/password';
import { useBiometryValidation } from 'src/form/validation/use-biometry';
import { useShelter } from 'src/shelter/use-shelter.hook';
import {
  hideLoaderAction,
  madeCloudBackupAction,
  requestSeedPhraseBackupAction,
  setIsAnalyticsEnabled,
  showLoaderAction
} from 'src/store/settings/settings-actions';
import { showSuccessToast, showErrorToastByError } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { cloudTitle, saveCloudBackup } from 'src/utils/cloud-backup';
import { isString } from 'src/utils/is-string';
import { generateSeed } from 'src/utils/keys.util';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

type CreateNewPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
  useBiometry?: boolean;
  acceptTerms: boolean;
  analytics: boolean;
};

export const createNewPasswordValidationSchema: SchemaOf<CreateNewPasswordFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  useBiometry: useBiometryValidation,
  acceptTerms: acceptTermsValidation,
  analytics: analyticsValidation
});

export const createNewPasswordInitialValues: CreateNewPasswordFormValues = {
  password: '',
  passwordConfirmation: '',
  acceptTerms: false,
  analytics: true
};

export const useHandleSubmit = (backupToCloud?: boolean, cloudBackupMnemonic?: string) => {
  const isRestoreFromCloudFlow = isString(cloudBackupMnemonic);

  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const { importWallet } = useShelter();

  const submit$ = useSubjectWithReSubscription$<CreateNewPasswordFormValues>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        tap(({ analytics }) => dispatch(setIsAnalyticsEnabled(analytics))),
        switchMap(({ password, useBiometry }) =>
          (isRestoreFromCloudFlow ? of(cloudBackupMnemonic) : from(generateSeed())).pipe(
            // importWallet dispatches `hideLoaderAction` when done
            tap(seedPhrase => importWallet({ seedPhrase, password, useBiometry })),
            map(seedPhrase => ({ seedPhrase, password }))
          )
        ),
        tap(({ seedPhrase, password }) => {
          if (Boolean(backupToCloud)) {
            return void doBackupToCloud(seedPhrase, password, dispatch).catch(error => {
              const errorTitle = 'Failed to back up to cloud';
              showErrorToastByError(error, errorTitle, true);

              trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
            });
          }

          if (!isRestoreFromCloudFlow) {
            dispatch(requestSeedPhraseBackupAction());
          }
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);
    },
    [
      isRestoreFromCloudFlow,
      backupToCloud,
      cloudBackupMnemonic,
      dispatch,
      importWallet,
      generateSeed,
      doBackupToCloud,
      trackEvent
    ]
  );

  return async (values: CreateNewPasswordFormValues) => submit$.next(values);
};

const doBackupToCloud = (seedPhrase: string, password: string, dispatch: Dispatch) =>
  saveCloudBackup(seedPhrase, password).then(() => {
    dispatch(madeCloudBackupAction());
    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
  });
