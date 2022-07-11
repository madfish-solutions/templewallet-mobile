import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTimerEffect } from '../hooks/use-timer-effect.hook';
import { checkApp } from '../store/security/security-actions';

const APP_CHECK_INTERVAL = 60 * 60 * 1000;

export const useFirebaseApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        // Native builds get the initializeApp config from google-services.json GoogleService-Info.plist
        //@ts-ignore
        await firebase.initializeApp();
      }
    })();
  }, []);

  useTimerEffect(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
