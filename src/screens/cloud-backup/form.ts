import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { madeCloudBackupAction } from 'src/store/settings/settings-actions';
import { callWithToastErrorThrown, callWithShowErrorToastOnError, showSuccessToast } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud, saveCloudBackup, syncCloud } from 'src/utils/cloud-backup';

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
    const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

    await callWithToastErrorThrown(() => saveCloudBackup(mnemonic, password), 'Failed to back up to cloud', true);

    dispatch(madeCloudBackupAction());
    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
    goBack();
  };

  const handleSubmit = ({ password }: EnterCloudPasswordFormValues): Promise<void> =>
    callWithShowErrorToastOnError(async () => {
      await assurePasswordIsCorrect(password);

      const loggedInToCloud = await callWithToastErrorThrown(requestSignInToCloud, 'Failed to log-in', true);

      if (!loggedInToCloud) {
        return;
      }

      await callWithToastErrorThrown(syncCloud, 'Failed to sync cloud');

      const backupFile = await callWithToastErrorThrown(fetchCloudBackupFileDetails, 'Failed to read from cloud', true);

      if (backupFile) {
        return void alertOnExistingBackup(
          () => void handleSubmit({ password }),
          () => void callWithShowErrorToastOnError(() => proceedWithSaving(password)),
          () => void navigate(ScreensEnum.ManualBackup)
        );
      }

      await proceedWithSaving(password);
    });

  return handleSubmit;
};
