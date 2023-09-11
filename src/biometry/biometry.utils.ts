import { Alert } from 'react-native';
import { securitySettings } from 'react-native-android-open-settings';

import { isAndroid } from '../config/system';
import { openUrl } from '../utils/linking';

export const openSecuritySettings = () =>
  Alert.alert(
    'Biometrics are disabled',
    'Please go to device settings to activate biometrics usage for the Temple Wallet',
    [
      { text: 'Open', onPress: () => (isAndroid ? securitySettings() : openUrl('App-Prefs:Security')) },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
