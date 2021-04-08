import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { Navigator } from '../navigator/navigator';
import { store } from '../store/store';

enableScreens();

export const isAuthorized = false;
export const isLocked = false;
export const isConfirmation = false;

export const App = () => {
  useEffect(() => void RNBootSplash.hide(), []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};
