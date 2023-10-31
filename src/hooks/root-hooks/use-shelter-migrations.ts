import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useBiometricsEnabledSelector } from 'src/store/settings/settings-selectors';
import { shouldUseOnlySoftwareInV1 } from 'src/utils/keychain.utils';

export const useShelterMigrations = async () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!(await Shelter.shouldDoSomeMigrations())) {
        console.log('No shelter migrations needed');

        return;
      }

      console.log('Starting shelter migration', biometricsEnabled, shouldUseOnlySoftwareInV1);
      if (biometricsEnabled && shouldUseOnlySoftwareInV1) {
        Alert.alert(
          'Data migration',
          "We've detected that your device is manufactured by Samsung or Google, and you have biometrics enabled. In \
order to prevent data corruption after your device's security update, we need to migrate your data from the device's \
security chip. Please confirm the migration using your biometrics to maintain uninterrupted use of the wallet.",
          [
            {
              text: 'Confirm',
              onPress: () => {
                dispatch(showLoaderAction());
                Shelter.doMigrations$().subscribe({
                  next: () => {
                    console.log('next');
                    dispatch(hideLoaderAction());
                  },
                  error: err => {
                    console.error(err);
                    dispatch(hideLoaderAction());
                    Alert.alert('Data migration', err.message);
                  }
                });
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }
    })();
  }, [dispatch, biometricsEnabled]);
};
