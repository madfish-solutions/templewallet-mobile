import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { isDefined } from '../utils/is-defined';

export const usePushNotifications = () => {
  useEffect(() => {
    requestUserPermission();
    const unsubscribe = notificationService();

    return unsubscribe;
  });

  return null;
};

const requestUserPermission = async () => {
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    await getFcmToken();
  }
};

const getFcmToken = async () => {
  const savedFcmToken = await AsyncStorage.getItem('fcmToken').catch(() => null);
  console.log(savedFcmToken, 'savedFcmToken');

  if (!isDefined(savedFcmToken)) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();

      if (isDefined(fcmToken)) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (e) {
      console.log(e);
    }
  }
};

const notificationService = () => {
  // Foreground notifications
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived in foreground!', JSON.stringify(remoteMessage));

    const { messageId, notification } = remoteMessage;

    if (isDefined(notification) && isDefined(notification.body)) {
      try {
        PushNotification.localNotification({
          channelId: 'channel-id',
          messageId,
          title: notification.title,
          message: notification.body,
          soundName: 'default',
          vibrate: true,
          playSound: true
        });
      } catch {}
    }
  });

  return unsubscribe;
};
