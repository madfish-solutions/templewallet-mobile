import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isIOS } from '../config/system';
import { useTimerEffect } from '../hooks/use-timer-effect.hook';
import { checkApp } from '../store/security/security-actions';

const APP_CHECK_INTERVAL = 60 * 60 * 1000;

const IOS_APP_ID = '1:1067475869467:ios:838d63298a5073892c3dbe';
const ANDROID_APP_ID = '1:1067475869467:android:a65f23f3674ab6052c3dbe';

export const useFirebaseApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet-fa3b3',
          appId: isIOS ? IOS_APP_ID : ANDROID_APP_ID
        });
      }
    })();
  }, []);

  useTimerEffect(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
