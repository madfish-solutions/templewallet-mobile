import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
/* eslint-disable-next-line import/no-named-as-default */
import PushNotification from 'react-native-push-notification';

import { isAndroid } from 'src/config/system';
import { isDefined } from 'src/utils/is-defined';

export const usePushNotifications = () => {
  useEffect(() => {
    requestUserPermission();
    const unsubscribe = handleForegroundNotifications();

    return unsubscribe;
  });
};

const requestUserPermission = async () => {
  let enabled = false;

  if (isAndroid) {
    enabled = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
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

const getFcmToken = async () => {
  const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);

  if (!isDefined(savedFcmToken)) {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();

    if (isDefined(fcmToken)) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
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
