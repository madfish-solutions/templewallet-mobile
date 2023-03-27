import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, madeCloudBackupAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { callWithToastErrorThrown, callWithShowErrorToastOnError, showSuccessToast } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud, saveCloudBackup } from 'src/utils/cloud-backup';

import { alertOnExistingBackup, assurePasswordIsCorrect } from './utils';

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

  const proceedWithSaving = async (password: string) => {
    dispatch(showLoaderAction());

    const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

    await callWithToastErrorThrown(() => saveCloudBackup(mnemonic, password), 'Failed to back up to cloud', true);

    dispatch(madeCloudBackupAction());
    dispatch(hideLoaderAction());
    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
    goBack();
  };

  const handleSubmit = ({ password }: EnterCloudPasswordFormValues): Promise<void> =>
    callWithShowErrorToastOnError(
      async () => {
        dispatch(showLoaderAction());

        await assurePasswordIsCorrect(password);

        const loggedInToCloud = await callWithToastErrorThrown(requestSignInToCloud, 'Failed to log-in', true);

        if (!loggedInToCloud) {
          return void dispatch(hideLoaderAction());
        }

        const backupFile = await callWithToastErrorThrown(
          fetchCloudBackupFileDetails,
          'Failed to read from cloud',
          true
        );

        dispatch(hideLoaderAction());

        if (backupFile) {
          return void alertOnExistingBackup(
            () => void handleSubmit({ password }),
            () => void callWithShowErrorToastOnError(() => proceedWithSaving(password)),
            () => void navigate(ScreensEnum.ManualBackup)
          );
        }

        await proceedWithSaving(password);
      },
      () => void dispatch(hideLoaderAction())
    );

  return handleSubmit;
};
