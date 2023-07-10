import 'react-native-gesture-handler';

import './shim.js';
import './handle-js-exception';

import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app/app';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
