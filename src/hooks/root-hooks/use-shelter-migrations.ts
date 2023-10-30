import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Shelter } from 'src/shelter/shelter';
import { useBiometricsEnabledSelector } from 'src/store/settings/settings-selectors';
import { shouldUseOnlySoftwareInV1 } from 'src/utils/keychain.utils';

export const useShelterMigrations = async () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!(await Shelter.shouldDoSomeMigrations())) {
        return;
      }

      console.log('Starting shelter migration');
      if (biometricsEnabled && shouldUseOnlySoftwareInV1) {
        Alert.alert(
          'Data migration',
          "We have detected that you have biometrics enabled and the device is manufactured by Samsung or Google. \
We need to migrate your data from the device's security chip to prevent its corruption after a security update. To \
do it, we need to read your biometrics once."
        );
      }
      Shelter.doMigrations$().subscribe(() => console.log('Shelter migrations done'));
    })();
  }, [dispatch, biometricsEnabled]);
};
