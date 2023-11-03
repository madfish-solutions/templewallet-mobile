import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useBiometricsEnabledSelector } from 'src/store/settings/settings-selectors';
import { setShouldMigrateOnRestartAction } from 'src/store/wallet/wallet-actions';
import { useShouldMigrateOnRestartSelector } from 'src/store/wallet/wallet-selectors';
import { shouldMoveToSoftwareInV1 } from 'src/utils/keychain.utils';

import { useAtBootsplash } from '../use-hide-bootsplash';

export const useShelterMigrations = async () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const dispatch = useDispatch();
  const shouldMigrateOnRestart = useShouldMigrateOnRestartSelector();
  const atBootsplash = useAtBootsplash();

  const doMigrations = useCallback(() => {
    dispatch(showLoaderAction());
    Shelter.doMigrations$().subscribe({
      next: () => {
        dispatch(setShouldMigrateOnRestartAction(false));
        dispatch(hideLoaderAction());
        Alert.alert(
          'Migration has succeeded',
          "All data has been successfully migrated from the device's security chip. Enjoy uninterrupted use of the wallet.",
          [{ text: 'Confirm' }]
        );
      },
      error: err => {
        dispatch(hideLoaderAction());
        Alert.alert('Migration has failed', err.message);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!shouldMigrateOnRestart || atBootsplash) {
      return;
    }

    if (biometricsEnabled && shouldMoveToSoftwareInV1) {
      Alert.alert(
        'Migration for Biometrics',
        "To prevent data corruption after your device's security update, confirm the migration using your biometrics \
to maintain uninterrupted use of the wallet",
        [
          {
            text: 'Confirm',
            onPress: doMigrations
          }
        ]
      );
    } else {
      doMigrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atBootsplash]);
};
