import * as Sentry from '@sentry/react-native';

export const initSentry = () =>
  !__DEV__ && Sentry.init({ dsn: 'https://e486e060eb034ad28b4261e41520871c@o911994.ingest.sentry.io/5848633' });
