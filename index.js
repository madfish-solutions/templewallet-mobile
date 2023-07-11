import 'react-native-gesture-handler';

import './shim.js';
import './handle-js-exception';

import { AppRegistry, PermissionsAndroid } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app/app';
import { isAndroid } from './src/config/system';

(async () => {
  if (isAndroid) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
})();

AppRegistry.registerComponent(appName, () => App);
