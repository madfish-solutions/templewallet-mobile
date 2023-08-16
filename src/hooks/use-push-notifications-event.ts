import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsPushNotificationsEventFired } from 'src/store/settings/settings-actions';
import { useIsPushNotificationsEventFiredSelector } from 'src/store/settings/settings-selectors';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { isDefined } from '../utils/is-defined';

export const usePushNotificationsEvent = () => {
  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();
  const isPushNotificationsEventFired = useIsPushNotificationsEventFiredSelector();

  useEffect(() => {
    (async () => {
      const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);

      if (!isPushNotificationsEventFired && isDefined(savedFcmToken)) {
        trackEvent('PUSH_NOTIFICATIONS_ENABLED');
        dispatch(setIsPushNotificationsEventFired(true));
      }
    })();
  }, []);
};
