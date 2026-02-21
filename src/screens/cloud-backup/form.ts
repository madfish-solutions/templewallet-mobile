import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { passwordValidation } from 'src/form/validation/password';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import {
  hideLoaderAction,
  madeCloudBackupAction,
  setOnRampOverlayStateAction,
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
import { useCloudAnalytics } from 'src/utils/cloud-backup/use-cloud-analytics';

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
  const navigateToScreen = useNavigateToScreen();
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const { trackCloudError, trackCloudSuccess } = useCloudAnalytics();
  const { trackEvent } = useAnalytics();
  const canUseOnRamp = useCanUseOnRamp();

  const proceedWithSaving = useCallback(
    async (password: string, replacing = false) => {
      try {
        dispatch(showLoaderAction());

        const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

        await saveCloudBackup(mnemonic, password).catch(catchThrowToastError('Failed to back up to cloud', true));

        dispatch(hideLoaderAction());
        dispatch(madeCloudBackupAction());
        canUseOnRamp && dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Start));

        showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
        goBack();

        trackCloudSuccess(replacing === true ? 'Wallet backup replaced' : 'Wallet backed-up');
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [canUseOnRamp, dispatch, goBack, trackCloudError, trackCloudSuccess]
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
              proceedWithSaving(password, true);
              trackEvent(CloudBackupSelectors.ReplaceBackupButton, AnalyticsEventCategory.ButtonPress);
            },
            () => {
              navigateToScreen({ screen: ScreensEnum.ManualBackup });
              trackEvent(CloudBackupSelectors.BackupManuallyButton, AnalyticsEventCategory.ButtonPress);
            },
            () => {
              submit(password);
              trackEvent(CloudBackupSelectors.ChangeAnAccountButton, AnalyticsEventCategory.ButtonPress);
            }
          );
        }

        return void proceedWithSaving(password);
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [dispatch, navigateToScreen, trackCloudError, proceedWithSaving, trackEvent]
  );

  return ({ password }: EnterCloudPasswordFormValues) => void submit(password);
};

const ensurePasswordIsCorrect = (password: string) =>
  firstValueFrom(Shelter.isPasswordCorrect$(password)).then(isPasswordCorrect => {
    if (!isPasswordCorrect) {
      throw new ToastError('Wrong password');
    }
  });
