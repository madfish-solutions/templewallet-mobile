import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Navigator } from '../navigator/navigator';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';

enableScreens();

export const App = () => {
  useEffect(() => void hide(), []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaProvider>
          <PortalProvider>
            <NavigationContainer>
              <Navigator />
            </NavigationContainer>

            <ToastProvider />
          </PortalProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};
