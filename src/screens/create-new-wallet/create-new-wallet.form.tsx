import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { filter, from, map, of, switchMap, tap } from 'rxjs';
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
import { showSuccessToast, buildPipeErrorToaster, showErrorToastByError } from 'src/toast/toast.utils';
import { saveCloudBackup } from 'src/utils/cloud-backup';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { generateSeed } from 'src/utils/keys.util';
import { useSubjectSubscription$ } from 'src/utils/rxjs.utils';

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

  const { importWallet } = useShelter();

  const submit$ = useSubjectSubscription$<CreateNewPasswordFormValues>(
    $subject =>
      $subject
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          tap(({ analytics }) => dispatch(setIsAnalyticsEnabled(analytics))),
          switchMap(({ password, useBiometry }) =>
            (isRestoreFromCloudFlow ? of(cloudBackupMnemonic) : from(generateSeed())).pipe(
              map(seedPhrase => {
                importWallet({ seedPhrase, password, useBiometry });

                return { seedPhrase, password };
              }),
              buildPipeErrorToaster()
            )
          ),
          tap(value => {
            // importWallet hides loader too
            !isDefined(value) && dispatch(hideLoaderAction());
          }),
          filter(isDefined)
        )
        .subscribe(({ seedPhrase, password }) => {
          if (Boolean(backupToCloud)) {
            return void doBackupToCloud(seedPhrase, password, dispatch);
          }

          if (!isRestoreFromCloudFlow) {
            dispatch(requestSeedPhraseBackupAction());
          }
        }),
    [isRestoreFromCloudFlow, backupToCloud, cloudBackupMnemonic, dispatch, importWallet, generateSeed, doBackupToCloud]
  );

  return async (values: CreateNewPasswordFormValues) => submit$.next(values);
};

const doBackupToCloud = (seedPhrase: string, password: string, dispatch: Dispatch) =>
  saveCloudBackup(seedPhrase, password)
    .then(() => {
      dispatch(madeCloudBackupAction());
      showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
    })
    .catch(error => void showErrorToastByError(error, 'Failed to back up to cloud', true));
