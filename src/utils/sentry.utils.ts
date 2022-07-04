import * as Sentry from '@sentry/react-native';

export const initSentry = () =>
  !__DEV__ && Sentry.init({ dsn: 'https://bdcaf035c39848a3a6203b837d431618@o946691.ingest.sentry.io/5895740' });
