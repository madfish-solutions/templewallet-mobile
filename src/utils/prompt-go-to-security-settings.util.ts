import { Alert, Linking } from 'react-native';
import { securitySettings as openSecuritySettings } from 'react-native-android-open-settings';

import { isAndroid } from '../config/system';

export const promptGoToSecuritySettings = () => {
  Alert.alert(
    "Can't setup biometrics",
    isAndroid
      ? 'Please go to device settings to setup fingerprint biometrics'
      : 'Please go to device settings to activate Face ID',
    [
      { text: 'OK', onPress: () => (isAndroid ? openSecuritySettings() : Linking.openURL('App-Prefs:Security')) },
      { text: 'Cancel' }
    ]
  );
};
