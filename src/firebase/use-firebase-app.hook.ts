import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';

import { isIOS } from '../config/system';

export const useFirebaseApp = () =>
  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet',
          appId: isIOS ? '1:14863818751:ios:77311aaef75709509f51ca' : '1:14863818751:android:6e6bb01b103964a69f51ca'
        });
      }
    })();
  }, []);
