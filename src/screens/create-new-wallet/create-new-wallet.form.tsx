import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
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
import { doesCloudBackupExist, saveCloudBackup } from 'src/utils/cloud-backup';
import { useCloudAnalytics } from 'src/utils/cloud-backup/use-cloud-analytics';
import { generateSeed } from 'src/utils/keys.util';

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
  const { trackCloudError, trackCloudSuccess } = useCloudAnalytics();

  const { importWallet } = useShelter();

  const backupFlowMemo = useMemo(() => backupFlow, backupFlow ? Object.values(backupFlow) : []);

  const doBackupToCloud = useCallback(
    async ({ seedPhrase, password }: DoBackupValues) => {
      try {
        const exists = await doesCloudBackupExist();
        if (exists) {
          throw new Error('Some backup already exists');
        }

        await saveCloudBackup(seedPhrase, password);

        dispatch(madeCloudBackupAction());

        showSuccessToast({ description: 'Your wallet has been backed up successfully!' });

        trackCloudSuccess('Wallet was backed-up');
      } catch (error) {
        const errorTitle = 'Failed to back up to cloud';
        showErrorToastByError(error, errorTitle, true);

        trackCloudError(error, errorTitle);
      }
    },
    [dispatch, trackCloudError, trackCloudSuccess]
  );

  return useCallback(
    async ({ password, useBiometry, analytics }: CreateNewPasswordFormValues) => {
      try {
        dispatch(showLoaderAction());
        dispatch(setIsAnalyticsEnabled(analytics));

        const seedPhrase = backupFlowMemo?.type === 'RESTORE' ? backupFlowMemo.mnemonic : await generateSeed();

        // importWallet dispatches `hideLoaderAction` when done
        importWallet({ seedPhrase, password, useBiometry });

        if (!backupFlowMemo) {
          return void dispatch(requestSeedPhraseBackupAction());
        }

        if (backupFlowMemo.type === 'AUTO_BACKUP') {
          doBackupToCloud({ seedPhrase, password });
        }
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);
      }
    },
    [backupFlowMemo, doBackupToCloud, dispatch, importWallet, generateSeed]
  );
};
