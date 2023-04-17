import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/error-toast.utils';
import { showSuccessToast } from 'src/toast/toast.utils';
import { requestSignInToCloud, fetchCloudBackupDetails, eraseCloudBackup } from 'src/utils/cloud-backup';

import { useEraseCloudBackupButtonStyles } from './backup.styles';

export const EraseCloudBackupButton: FC = () => {
  const [backupExists, setBackupExists] = useState(false);
  const styles = useEraseCloudBackupButtonStyles();

  useEffect(() => {
    (async () => {
      try {
        await requestSignInToCloud().catch(catchThrowToastError('Failed to log-in', true));
        const backup = await fetchCloudBackupDetails().catch(catchThrowToastError('Failed to check backup', true));

        setBackupExists(Boolean(backup));
      } catch (error) {
        showErrorToastByError(error);
      }
    })();
  }, []);

  if (!backupExists) {
    return null;
  }

  const handlePress = async () => {
    try {
      await eraseCloudBackup().catch(catchThrowToastError("Couldn't erase backup", true));

      setBackupExists(false);
      showSuccessToast({ description: 'Backup erased' });
    } catch (error) {
      showErrorToastByError(error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Erase cloud backup</Text>
      <Icon name={IconNameEnum.Trash} />
    </TouchableOpacity>
  );
};
