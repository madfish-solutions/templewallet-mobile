import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isIOS } from '../config/system';
import { useTimerEffect } from '../hooks/use-timer-effect.hook';
import { checkApp } from '../store/security/security-actions';
import { ANDROID_APP_ID, FIREBASE_PROJECT_ID, IOS_APP_ID } from '../utils/env.utils';

const APP_CHECK_INTERVAL = 60 * 60 * 1000;

export const useFirebaseApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        // await firebase.initializeApp({
        //   projectId: FIREBASE_PROJECT_ID,
        //   appId: isIOS ? IOS_APP_ID : ANDROID_APP_ID
        // });
      }
    })();
  }, []);

  useTimerEffect(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
