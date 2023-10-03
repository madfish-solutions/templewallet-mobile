import { sendAnalyticsEvent } from './analytics/analytics.util';

export const persistFailHandler = (error: Error) =>
  void sendAnalyticsEvent('REDUX_PERSIST_FAIL', undefined, undefined, { message: error.message });
