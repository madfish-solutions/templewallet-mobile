import React, { useEffect } from 'react';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';

enableScreens();

export const App = () => {
  useEffect(() => void hide(), []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaProvider>
          <RootStackScreen />
          <ToastProvider />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};
