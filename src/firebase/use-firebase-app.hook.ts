import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isIOS } from '../config/system';
import { useTimerEffect } from '../hooks/use-timer-effect.hook';
import { checkApp } from '../store/security/security-actions';

const APP_CHECK_INTERVAL = 60 * 60 * 1000;

export const useFirebaseApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet-fa3b3',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          appId: isIOS ? process.env.IOS_APP_ID! : process.env.ANDROID_APP_ID!
        });
      }
    })();
  }, []);

  useTimerEffect(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
