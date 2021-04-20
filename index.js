import './shim.js';

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app/app';

AppRegistry.registerComponent(appName, () => App);
