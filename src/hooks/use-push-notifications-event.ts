import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsPushNotificationsEnabledEventFired } from 'src/store/settings/settings-actions';
import { useIsPushNotificationsEnabledEventFiredSelector } from 'src/store/settings/settings-selectors';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { isDefined } from '../utils/is-defined';

export const usePushNotificationsEvent = () => {
  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();
  const isPushNotificationsEnabledEventFired = useIsPushNotificationsEnabledEventFiredSelector();

  useEffect(() => {
    (async () => {
      if (isPushNotificationsEnabledEventFired) {
        return;
      }

      const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);

      if (isDefined(savedFcmToken)) {
        trackEvent('PUSH_NOTIFICATIONS_ENABLED');
        dispatch(setIsPushNotificationsEnabledEventFired(true));
      }
    })();
  }, []);
};
