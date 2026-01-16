import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
/* eslint-disable-next-line import/default */
import PushNotification from 'react-native-push-notification';
import { useDispatch } from 'react-redux';

import { isAndroid } from 'src/config/system';
import { setShouldRedirectToNotificationsAction } from 'src/store/notifications/notifications-actions';
import { isDefined } from 'src/utils/is-defined';

export const usePushNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    requestUserPermission(getFcmToken);
    const unsubscribeFromFgNotifications = handleForegroundNotifications();

    const handleRemoteMessage = () => void dispatch(setShouldRedirectToNotificationsAction(true));

    const unsubscribeFromNotificationOpenedApp = messaging().onNotificationOpenedApp(handleRemoteMessage);
    messaging()
      .getInitialNotification()
      .then(message => message && handleRemoteMessage())
      .catch(error => console.error(error));

    return () => {
      unsubscribeFromFgNotifications();
      unsubscribeFromNotificationOpenedApp();
    };
  }, []);

  const getFcmToken = useCallback(async () => {
    const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);

    if (!isDefined(savedFcmToken)) {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();

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
    const iosAuthStatus = await messaging().requestPermission();
    enabled =
      iosAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      iosAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  if (enabled) {
    await getFcmToken();
  }
};

const handleForegroundNotifications = () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const { messageId, notification } = remoteMessage;

    if (isDefined(notification) && isDefined(notification.body)) {
      PushNotification.localNotification({
        channelId: 'channel-id',
        messageId,
        title: notification.title,
        message: notification.body,
        soundName: 'default',
        vibrate: true,
        playSound: true
      });
    }
  });

  return unsubscribe;
};
