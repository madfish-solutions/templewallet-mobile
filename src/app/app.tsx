import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import { Navigator } from '../navigator/navigator';

enableScreens();

export const isAuthorized = false;
export const isLocked = false;
export const isConfirmation = false;

export const App = () => {
  useEffect(() => void RNBootSplash.hide(), []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};
