import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Navigator } from '../navigator/navigator';
import { persistor, store } from '../store/store';

enableScreens();

export const App = () => {
  useEffect(() => void hide(), []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};
