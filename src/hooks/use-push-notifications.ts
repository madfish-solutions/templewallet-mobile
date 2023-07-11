import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
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
  if (isAndroid) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

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
