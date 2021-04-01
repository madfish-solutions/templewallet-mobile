import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import { Navigator } from '../navigator/navigator';
import RNBootSplash from 'react-native-bootsplash';

enableScreens();

export const isAuthorized = true;
export const isLocked = true;
export const isConfirmation = true;

export const App = () => {
  useEffect(() => void RNBootSplash.hide(), []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};
