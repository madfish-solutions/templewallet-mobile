import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { isAndroid } from 'src/config/system';
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
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import {
  FAILED_TO_LOGIN_ERR_TITLE,
  doesCloudBackupExist,
  requestSignInToCloud,
  saveCloudBackup
} from 'src/utils/cloud-backup';
import { useCloudResponseHandler } from 'src/utils/cloud-backup/use-track-cloud-error';

import { CloudBackupSelectors } from './selectors';
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
  const { trackCloudError, trackCloudSuccess } = useCloudResponseHandler();
  const { trackEvent } = useAnalytics();

  const replaceBackup = useCallback(
    async (password: string) => {
      try {
        dispatch(showLoaderAction());

        const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

        await saveCloudBackup(mnemonic, password).catch(catchThrowToastError('Failed to back up to cloud', true));

        dispatch(hideLoaderAction());
        dispatch(madeCloudBackupAction());
        isAndroid && dispatch(setOnRampPossibilityAction(true));

        showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
        goBack();

        trackCloudSuccess('Replace back up to cloud');
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [dispatch, goBack, trackCloudError, trackCloudSuccess]
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
            () => {
              replaceBackup(password);
              trackEvent(CloudBackupSelectors.ReplaceBackup, AnalyticsEventCategory.ButtonPress);
            },
            () => {
              navigate(ScreensEnum.ManualBackup);
              trackEvent(CloudBackupSelectors.BackupManually, AnalyticsEventCategory.ButtonPress);
            },
            () => {
              submit(password);
              trackEvent(CloudBackupSelectors.ChangeAnAccount, AnalyticsEventCategory.ButtonPress);
            }
          );
        }

        return void replaceBackup(password);
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [dispatch, navigate, trackCloudError, replaceBackup, trackEvent]
  );

  return ({ password }: EnterCloudPasswordFormValues) => void submit(password);
};

const ensurePasswordIsCorrect = (password: string) =>
  firstValueFrom(Shelter.isPasswordCorrect$(password)).then(isPasswordCorrect => {
    if (!isPasswordCorrect) {
      throw new ToastError('Wrong password');
    }
  });
