import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ONE_MINUTE } from 'src/config/fixed-times';
import { checkApp } from 'src/store/security/security-actions';
import { useInterval } from 'src/utils/hooks';

const APP_CHECK_INTERVAL = 60 * ONE_MINUTE;

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

  useInterval(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
