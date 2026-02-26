import 'react-native-gesture-handler';

import './shim.js';
import './handle-js-exception';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { AppBootstrap } from './src/app/bootstrap';

AppRegistry.registerComponent(appName, () => AppBootstrap);
