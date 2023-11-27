import { noop } from 'lodash-es';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { FATAL_MIGRATION_ERROR_MESSAGE, Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useBiometricsEnabledSelector } from 'src/store/settings/settings-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { shouldMoveToSoftwareInV1 } from 'src/utils/keychain.utils';

export const useDoMigrations = (onEnd = noop) => {
  const dispatch = useDispatch();
  const biometricsEnabled = useBiometricsEnabledSelector();

  const doMigrationsWithoutAlert = useCallback(() => {
    dispatch(showLoaderAction());
    Shelter.doMigrations$().subscribe({
      next: () => {
        dispatch(hideLoaderAction());
        showSuccessToast({
          title: 'Success!',
          description: 'All data has been successfully migrated. Enjoy uninterrupted use of the wallet.'
        });
        onEnd();
      },
      error: err => {
        dispatch(hideLoaderAction());
        Alert.alert('Migration has failed', err.message, [
          err.message === FATAL_MIGRATION_ERROR_MESSAGE
            ? { text: 'Ok', onPress: onEnd }
            : { text: 'Try again', onPress: doMigrationsWithoutAlert }
        ]);
      }
    });
  }, [dispatch, onEnd]);

  return useCallback(() => {
    if (biometricsEnabled && shouldMoveToSoftwareInV1) {
      Alert.alert(
        'Biometric confirmation',
        'Please confirm the migration using your biometrics and don’t close the app until the migration is complete.',
        [
          {
            text: 'Confirm',
            onPress: doMigrationsWithoutAlert
          }
        ]
      );
    } else {
      doMigrationsWithoutAlert();
    }
  }, [biometricsEnabled, doMigrationsWithoutAlert]);
};
