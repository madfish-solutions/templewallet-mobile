import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';

import './shim.js';

import { name as appName } from './app.json';
import { App } from './src/app/app';

AppRegistry.registerComponent(appName, () => App);
