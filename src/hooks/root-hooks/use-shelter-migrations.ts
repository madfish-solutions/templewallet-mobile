import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useBiometricsEnabledSelector } from 'src/store/settings/settings-selectors';
import { shouldUseOnlySoftwareInV1 } from 'src/utils/keychain.utils';

export const useShelterMigrations = async () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const dispatch = useDispatch();

  const doMigrations = useCallback(() => {
    dispatch(showLoaderAction());
    Shelter.doMigrations$().subscribe({
      next: () => dispatch(hideLoaderAction()),
      error: err => {
        console.error(err);
        dispatch(hideLoaderAction());
        Alert.alert('Data migration', err.message);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (!(await Shelter.shouldDoSomeMigrations())) {
        return;
      }

      if (biometricsEnabled && shouldUseOnlySoftwareInV1) {
        Alert.alert(
          'Data migration',
          "We've detected that your device is manufactured by Samsung or Google, and you have biometrics enabled. In \
order to prevent data corruption after your device's security update, we need to migrate your data from the device's \
security chip. Please confirm the migration using your biometrics to maintain uninterrupted use of the wallet.",
          [
            {
              text: 'Confirm',
              onPress: doMigrations
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        doMigrations();
      }
    })();
  }, [dispatch, biometricsEnabled]);
};
