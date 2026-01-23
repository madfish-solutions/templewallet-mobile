import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMessaging,
  onNotificationOpenedApp,
  getInitialNotification,
  registerDeviceForRemoteMessages,
  getToken,
  requestPermission,
  AuthorizationStatus,
  onMessage,
  Messaging
} from '@react-native-firebase/messaging';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import { isAndroid } from 'src/config/system';
import { setShouldRedirectToNotificationsAction } from 'src/store/notifications/notifications-actions';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getFirebaseApp } from 'src/utils/firebase-app.util';
import { isDefined } from 'src/utils/is-defined';

export const usePushNotifications = () => {
  const { trackErrorEvent } = useAnalytics();
  const dispatch = useDispatch();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);

      return;
    }

    let unsubscribeFromFgNotifications: EmptyFn | undefined;
    let unsubscribeFromNotificationOpenedApp: EmptyFn | undefined;

    Promise.all([getFirebaseApp(), requestUserPermission(getFcmToken)])
      .then(([app]) => {
        const messaging = getMessaging(app);
        const handleRemoteMessage = () => void dispatch(setShouldRedirectToNotificationsAction(true));
        unsubscribeFromFgNotifications = handleForegroundNotifications(messaging);
        unsubscribeFromNotificationOpenedApp = onNotificationOpenedApp(messaging, handleRemoteMessage);

        getInitialNotification(messaging)
          .then(message => message && handleRemoteMessage())
          .catch(error => console.error(error));
      })
      .catch(error => {
        console.error(error);
        trackErrorEvent('RequestPushNotificationsError', error);
      });

    return () => {
      unsubscribeFromFgNotifications?.();
      unsubscribeFromNotificationOpenedApp?.();
    };
  }, [isFirstMount]);

  const getFcmToken = useCallback(async () => {
    const messaging = getMessaging(await getFirebaseApp());
    const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);

    if (!isDefined(savedFcmToken)) {
      await registerDeviceForRemoteMessages(messaging);
      const fcmToken = await getToken(messaging);

      if (isDefined(fcmToken)) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }, []);
};

const requestUserPermission = async (getFcmToken: () => void) => {
  let enabled = false;

  if (isAndroid) {
    enabled = (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) === 'granted';
  } else {
    const messaging = getMessaging(await getFirebaseApp());
    const iosAuthStatus = await requestPermission(messaging);
    enabled = iosAuthStatus === AuthorizationStatus.AUTHORIZED || iosAuthStatus === AuthorizationStatus.PROVISIONAL;
  }

  if (enabled) {
    await getFcmToken();
  }
};

const handleForegroundNotifications = (messaging: Messaging) => {
  const unsubscribe = onMessage(messaging, async remoteMessage => {
    const { messageId, notification, data } = remoteMessage;

    if (isDefined(notification) && isDefined(notification.body)) {
      const { title, body, android = {}, ios = {} } = notification;

      notifee.displayNotification({
        id: messageId,
        title,
        subtitle: isAndroid ? undefined : ios.subtitle,
        body,
        data,
        android,
        ios: {
          ...ios,
          sound: typeof ios.sound === 'string' ? ios.sound : ios.sound?.name
        }
      });
    }
  });

  return unsubscribe;
};
