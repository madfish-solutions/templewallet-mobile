import React from 'react';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { HideBalanceProvider } from '../hooks/hide-balance/hide-balance.provider';
import { useDelayedEffect } from '../hooks/use-delayed-effect.hook';
import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { initSentry } from '../utils/sentry.utils';

initSentry();
enableScreens();

export const App = () => {
  useDelayedEffect(() => void hide(), []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BiometryAvailabilityProvider>
          <HideBalanceProvider>
            <SafeAreaProvider>
              <RootStackScreen />
              <ToastProvider />
            </SafeAreaProvider>
          </HideBalanceProvider>
        </BiometryAvailabilityProvider>
      </PersistGate>
    </Provider>
  );
};
