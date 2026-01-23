import { initializeApp, getApps } from '@react-native-firebase/app';
import memoizee from 'memoizee';

import { isDefined } from './is-defined';

export const getFirebaseApp = memoizee(
  () =>
    // @ts-expect-error: Native builds get the initializeApp config from google-services.json GoogleService-Info.plist
    initializeApp().catch(e => {
      const app = getApps()[0];

      if (isDefined(app)) {
        return app;
      }

      throw e;
    }),
  { promise: true }
);
