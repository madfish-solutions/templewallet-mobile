import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';

const allowInDevMode = false;

setJSExceptionHandler((error, isFatal) => {
  Sentry.captureException(error.originalError ?? error);

  // TODO: remove this when taquito will fix this issue https://github.com/ecadlabs/taquito/issues/1040
  const isTaquitoMissedBlockError = error.name === 'MissedBlockDuringConfirmationError';

  isFatal &&
    !isTaquitoMissedBlockError &&
    Alert.alert(
      'Ooops, something went wrong',
      'We have reported this to our team! \nRestart the app and try again. \nIf this continues - please Reset the wallet.',
      [
        {
          text: 'Restart',
          style: 'cancel',
          onPress: () => RNRestart.Restart()
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            AsyncStorage.clear();
            RNRestart.Restart();
          }
        }
      ]
    );
}, allowInDevMode);
