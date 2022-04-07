import { firebase } from '@react-native-firebase/app-check';
import { useEffect } from 'react';

export const useFirebaseApp = () =>
  useEffect(() => {
    (async () => {
      if (firebase.apps.length === 0) {
        await firebase.initializeApp({
          projectId: 'templewallet',
          appId: '1:14863818751:android:6e6bb01b103964a69f51ca'
        });
      }
    })();
  }, []);
