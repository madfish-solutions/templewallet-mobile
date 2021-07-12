import { Alert, Linking } from 'react-native';
import { securitySettings } from 'react-native-android-open-settings';

import { isAndroid } from '../config/system';

export const openSecuritySettings = () =>
  Alert.alert(
    'Biometrics are disabled',
    'Please go to device settings to activate biometrics usage for the Temple Wallet',
    [
      { text: 'Open', onPress: () => (isAndroid ? securitySettings() : Linking.openURL('App-Prefs:Security')) },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
