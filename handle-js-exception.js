import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { setJSExceptionHandler } from 'react-native-exception-handler';

const allowInDevMode = false;

setJSExceptionHandler((error, isFatal) => {
  // TODO: add Sentry error capturing

  isFatal &&
    Alert.alert(
      'Ooops, something went wrong',
      'We have reported this to our team! Please restart the app and try again!',
      [
        {
          text: 'Close',
          onPress: () => {
            AsyncStorage.clear();
            // TODO: setup CodePush and call restartApp() here
          }
        }
      ]
    );
}, allowInDevMode);
