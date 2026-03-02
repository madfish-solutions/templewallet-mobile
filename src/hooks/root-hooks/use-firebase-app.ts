import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ONE_MINUTE } from 'src/config/fixed-times';
import { checkApp } from 'src/store/security/security-actions';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getFirebaseApp } from 'src/utils/firebase-app.util';
import { useInterval } from 'src/utils/hooks';

const APP_CHECK_INTERVAL = 60 * ONE_MINUTE;

export const useFirebaseApp = () => {
  const { trackErrorEvent } = useAnalytics();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        getFirebaseApp().catch(error => {
          console.error(error);
          trackErrorEvent('InitializeFirebaseAppError', error);
        });
      }
    })();
  }, []);

  useInterval(() => dispatch(checkApp.submit()), APP_CHECK_INTERVAL);
};
