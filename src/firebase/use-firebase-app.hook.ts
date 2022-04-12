import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getEnv } from '../../e2e/utils/env.utils';
import { isIOS } from '../config/system';
import { useTimerEffect } from '../hooks/use-timer-effect.hook';
import { checkApp } from '../store/security/security-actions';

const APP_CHECK_INTERVAL = 60 * 60 * 1000;

const iosAppId = getEnv('IOS_APP_ID');
const androidAppId = getEnv('ANDROID_APP_ID');

export const useFirebaseApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet-fa3b3',
          appId: isIOS ? iosAppId : androidAppId
        });
      }
    })();
  }, []);

  useTimerEffect(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
