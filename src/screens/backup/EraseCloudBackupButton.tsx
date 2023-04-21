import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/error-toast.utils';
import { showSuccessToast } from 'src/toast/toast.utils';
import { requestSignInToCloud, eraseCloudBackup, doesCloudBackupExist } from 'src/utils/cloud-backup';

import { useEraseCloudBackupButtonStyles } from './backup.styles';

export const EraseCloudBackupButton: FC = () => {
  const [backupExists, setBackupExists] = useState(false);
  const styles = useEraseCloudBackupButtonStyles();

  useEffect(() => {
    (async () => {
      try {
        await requestSignInToCloud().catch(catchThrowToastError('Failed to log-in', true));
        const exists = await doesCloudBackupExist().catch(catchThrowToastError('Failed to check backup', true));

        setBackupExists(exists);
      } catch (error) {
        showErrorToastByError(error);
      }
    })();
  }, []);

  if (!backupExists) {
    return null;
  }

  const handlePress = () => {
    const erase = async () => {
      try {
        await eraseCloudBackup().catch(catchThrowToastError("Couldn't erase backup", true));

        setBackupExists(false);
        showSuccessToast({ description: 'Backup erased' });
      } catch (error) {
        showErrorToastByError(error);
      }
    };

    Alert.alert(
      'Erasing cloud backup',
      'Are you sure? This operation cannot be reverted.',
      [
        {
          text: 'Erase',
          onPress: erase
        },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true
      }
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Erase cloud backup</Text>
      <Icon name={IconNameEnum.Trash} />
    </TouchableOpacity>
  );
};
