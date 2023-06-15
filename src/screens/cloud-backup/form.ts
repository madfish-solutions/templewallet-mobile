import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import {
  hideLoaderAction,
  madeCloudBackupAction,
  setOnRampPossibilityAction,
  showLoaderAction
} from 'src/store/settings/settings-actions';
import { showSuccessToast, catchThrowToastError, ToastError, showErrorToastByError } from 'src/toast/toast.utils';
import {
  FAILED_TO_LOGIN_ERR_TITLE,
  doesCloudBackupExist,
  requestSignInToCloud,
  saveCloudBackup
} from 'src/utils/cloud-backup';
import { useTrackCloudError } from 'src/utils/cloud-backup/use-track-cloud-error';

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
  const trackCloudError = useTrackCloudError();

  const proceedWithSaving = useCallback(
    async (password: string) => {
      try {
        dispatch(showLoaderAction());

        const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

        await saveCloudBackup(mnemonic, password).catch(catchThrowToastError('Failed to back up to cloud', true));

        dispatch(hideLoaderAction());
        dispatch(madeCloudBackupAction());
        showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
        goBack();
        dispatch(setOnRampPossibilityAction(true));
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [dispatch, goBack, trackCloudError]
  );

  const submit: (password: string) => Promise<void> = useCallback(
    async (password: string) => {
      try {
        dispatch(showLoaderAction());

        await ensurePasswordIsCorrect(password);

        const isLoggedIn = await requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true));

        if (!isLoggedIn) {
          return void dispatch(hideLoaderAction());
        }

        const backupExists = await doesCloudBackupExist().catch(
          catchThrowToastError('Failed to read from cloud', true)
        );

        if (backupExists) {
          dispatch(hideLoaderAction());

          return void alertOnExistingBackup(
            () => void submit(password),
            () => void proceedWithSaving(password),
            () => void navigate(ScreensEnum.ManualBackup)
          );
        }

        return void proceedWithSaving(password);
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [dispatch, navigate, trackCloudError, proceedWithSaving]
  );

  return ({ password }: EnterCloudPasswordFormValues) => void submit(password);
};

const ensurePasswordIsCorrect = (password: string) =>
  firstValueFrom(Shelter.isPasswordCorrect$(password)).then(isPasswordCorrect => {
    if (!isPasswordCorrect) {
      throw new ToastError('Wrong password');
    }
  });
