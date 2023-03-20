import { Alert, AlertButton } from 'react-native';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { isAndroid } from 'src/config/system';
import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { madeCloudBackupAction } from 'src/store/settings/settings-actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import {
  cloudTitle,
  fetchCloudBackupFileDetails,
  requestSignInToCloud,
  saveCloudBackup,
  syncCloud
} from 'src/utils/cloud-backup';

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

  const handleSubmit = async ({ password }: EnterCloudPasswordFormValues): Promise<void> => {
    const isPasswordCorrect = await firstValueFrom(Shelter.isPasswordCorrect$(password));

    if (!isPasswordCorrect) {
      return void showErrorToast({ description: 'Wrong password' });
    }

    try {
      const loggedInToCloud = await requestSignInToCloud();

      if (!loggedInToCloud) {
        return;
      }
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to log-in',
        description: (error as Error)?.message ?? 'Unknown reason'
      });
    }

    try {
      await syncCloud();
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to sync cloud',
        description: (error as Error)?.message ?? 'Unknown reason'
      });
    }

    const backupFile = await fetchCloudBackupFileDetails();

    if (backupFile) {
      return void alertOnExistingBackup(
        () => void handleSubmit({ password }),
        proceedWithSaving,
        () => void navigate(ScreensEnum.ManualBackup)
      );
    }

    await proceedWithSaving();

    async function proceedWithSaving() {
      const mnemonic = await new Promise<string>(resolve =>
        Shelter.revealSeedPhrase$().subscribe(m => void resolve(m))
      );

      try {
        await saveCloudBackup(mnemonic, password);
      } catch (error) {
        return void showErrorToast({
          title: 'Failed to back up to cloud',
          description: (error as Error)?.message ?? ''
        });
      }

      dispatch(madeCloudBackupAction());
      showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
      goBack();
    }
  };

  return handleSubmit;
};

const alertOnExistingBackup = (
  onChangeAccountPress: () => void,
  onReplaceBackupPress: () => void,
  onBackupManuallyPress: () => void
) => {
  const title = `Your ${cloudTitle} account already has a wallet backup.`;

  const message = [
    'If you create a new backup, your previous one will be irretrievably deleted.',
    ` Instead, you can reveal and manually save your seed phrase or change your ${cloudTitle} account to keep a new backup.`,
    `\n\nRemember, one ${cloudTitle} account can only have one wallet backup.`
  ].join();

  const buttons: AlertButton[] = [
    {
      text: 'Create a new backup',
      onPress: onReplaceBackupPress
    },
    {
      text: 'Backup manually',
      onPress: onBackupManuallyPress
    }
  ];

  if (isAndroid) {
    buttons.push({
      text: 'Change an account',
      onPress: onChangeAccountPress
    });

    buttons.reverse();
  }

  return void Alert.alert(title, message, buttons, {
    cancelable: true
  });
};
