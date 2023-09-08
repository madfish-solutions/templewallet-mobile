import { Alert, AlertButton } from 'react-native';

import { isAndroid } from 'src/config/system';
import { cloudTitle } from 'src/utils/cloud-backup';

export const alertOnExistingBackup = (
  onReplaceBackupPress: () => void,
  onBackupManuallyPress: () => void,
  onChangeAccountPress: () => void
) => {
  const title = `Your ${cloudTitle} account already has a wallet backup.`;

  const message = [
    'If you create a new backup, your previous one will be irretrievably deleted.',
    ` Instead, you can reveal and manually save your seed phrase or change your ${cloudTitle} account to keep a new backup.`,
    `\n\nRemember, one ${cloudTitle} account can only have one wallet backup.`
  ].join('');

  const buttons: AlertButton[] = [
    {
      text: 'Replace backup',
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
