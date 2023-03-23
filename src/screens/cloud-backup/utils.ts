import { Alert, AlertButton } from 'react-native';
import { firstValueFrom } from 'rxjs';

import { isAndroid } from 'src/config/system';
import { Shelter } from 'src/shelter/shelter';
import { ToastError } from 'src/toast/toast.utils';
import { cloudTitle } from 'src/utils/cloud-backup';

export const assurePasswordIsCorrect = async (password: string) => {
  const isPasswordCorrect = await firstValueFrom(Shelter.isPasswordCorrect$(password));

  if (!isPasswordCorrect) {
    throw new ToastError('Wrong password');
  }
};

export const alertOnExistingBackup = (
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
