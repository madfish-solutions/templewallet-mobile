import { useCallback, useMemo } from 'react';
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
import { cloudTitle, fetchCloudBackupDetails, saveCloudBackup } from 'src/utils/cloud-backup';
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

export type BackupFlow =
  | { type: 'AUTO_BACKUP' }
  | {
      type: 'RESTORE';
      mnemonic: string;
    };

interface DoBackupValues {
  seedPhrase: string;
  password: string;
}

export const useHandleSubmit = (backupFlow?: BackupFlow) => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const { importWallet } = useShelter();

  const backupFlowMemo = useMemo(() => backupFlow, backupFlow ? Object.values(backupFlow) : []);

  const doBackupToCloud = useCallback(
    async ({ seedPhrase, password }: DoBackupValues) => {
      try {
        const details = await fetchCloudBackupDetails();
        if (Boolean(details)) {
          throw new Error('Some backup already exists');
        }

        await saveCloudBackup(seedPhrase, password);

        dispatch(madeCloudBackupAction());
        showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
      } catch (error) {
        const errorTitle = 'Failed to back up to cloud';
        showErrorToastByError(error, errorTitle, true);

        trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
      }
    },
    [dispatch, trackEvent]
  );

  const submit$ = useSubjectWithReSubscription$<CreateNewPasswordFormValues>(
    $subject =>
      $subject.pipe(
        tap(() => dispatch(showLoaderAction())),
        tap(({ analytics }) => dispatch(setIsAnalyticsEnabled(analytics))),
        switchMap(({ password, useBiometry }) =>
          (backupFlowMemo?.type === 'RESTORE' ? of(backupFlowMemo.mnemonic) : from(generateSeed())).pipe(
            // importWallet dispatches `hideLoaderAction` when done
            tap(seedPhrase => importWallet({ seedPhrase, password, useBiometry })),
            map(seedPhrase => ({ seedPhrase, password }))
          )
        ),
        tap(doBackupValues => {
          console.log('backupFlowMemo: ', backupFlowMemo);
          if (!backupFlowMemo) {
            return void dispatch(requestSeedPhraseBackupAction());
          }

          if (backupFlowMemo.type === 'AUTO_BACKUP') {
            doBackupToCloud(doBackupValues);
          }
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);
    },
    [backupFlowMemo, doBackupToCloud, dispatch, importWallet, generateSeed]
  );

  return async (values: CreateNewPasswordFormValues) => submit$.next(values);
};
