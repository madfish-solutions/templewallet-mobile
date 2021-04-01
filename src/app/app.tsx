import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { DemoScreen } from '../screens/demo-screen/demo-screen';

export const App = () => {
  return (
    <NavigationContainer>
      <DemoScreen />
    </NavigationContainer>
  );
};
