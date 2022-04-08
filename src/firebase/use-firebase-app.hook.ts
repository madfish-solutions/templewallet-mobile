import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';

import { isIOS } from '../config/system';

export const useFirebaseApp = () =>
  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet-fa3b3',
          appId: isIOS ? '1:1067475869467:ios:838d63298a5073892c3dbe' : '1:1067475869467:android:a65f23f3674ab6052c3dbe'
        });
      }
    })();
  }, []);
