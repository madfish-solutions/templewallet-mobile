import React from 'react';
import { LogBox } from 'react-native';
import { hide, show } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../config/animation';
// import { emptyFn } from '../config/general';
import { HideBalanceProvider } from '../hooks/hide-balance/hide-balance.provider';
import { useAppStateStatus } from '../hooks/use-app-state-status.hook';
import { useDelayedEffect } from '../hooks/use-delayed-effect.hook';
import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { initSentry } from '../utils/sentry.utils';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => {
  useAppStateStatus(
    () => {
      // show();
      console.log('first func');
      setTimeout(() => hide(), HIDE_SPLASH_SCREEN_TIMEOUT);
    },
    () => {
      show();
      console.log('second func');
      // setTimeout(() => hide(), HIDE_SPLASH_SCREEN_TIMEOUT);
    }
  );
  useDelayedEffect(HIDE_SPLASH_SCREEN_TIMEOUT, () => void hide({ fade: true }), []);

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
