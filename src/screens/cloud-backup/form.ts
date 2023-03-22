import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { madeCloudBackupAction } from 'src/store/settings/settings-actions';
import { showSuccessToast } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud, saveCloudBackup, syncCloud } from 'src/utils/cloud-backup';

import { alertOnExistingBackup, assurePasswordIsCorrect, callWithErrorToast } from './utils';

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

  const proceedWithSaving = useCallback(
    async (password: string) => {
      const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());

      await callWithErrorToast(() => saveCloudBackup(mnemonic, password), 'Failed to back up to cloud', true);

      dispatch(madeCloudBackupAction());
      showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
      goBack();
    },
    [goBack, dispatch]
  );

  const handleSubmit = useCallback(
    async ({ password }: EnterCloudPasswordFormValues): Promise<void> => {
      await callWithErrorToast(() => assurePasswordIsCorrect(password), 'Wrong password');

      const loggedInToCloud = await callWithErrorToast(requestSignInToCloud, 'Failed to log-in', true);

      if (!loggedInToCloud) {
        return;
      }

      await callWithErrorToast(syncCloud, 'Failed to sync cloud');

      const backupFile = await callWithErrorToast(fetchCloudBackupFileDetails, 'Failed to read from cloud', true);

      if (backupFile) {
        return void alertOnExistingBackup(
          () => void handleSubmit({ password }),
          () => void proceedWithSaving(password),
          () => void navigate(ScreensEnum.ManualBackup)
        );
      }

      await proceedWithSaving(password);
    },
    [navigate, proceedWithSaving]
  );

  return handleSubmit;
};
