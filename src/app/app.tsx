import { AnalyticsProvider } from '@segment/analytics-react-native';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { hide } from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../config/animation';
import { HideBalanceProvider } from '../hooks/hide-balance/hide-balance.provider';
import { RootStackScreen } from '../navigator/root-stack';
import { AppLockContextProvider } from '../shelter/app-lock/app-lock';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { segmentClient } from '../utils/analytics/analytics.util';
import { initSentry } from '../utils/sentry.utils';
import { AppStyles } from './app.styles';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => {
  const [atBootsplash, setAtBootsplash] = useState(true);
  useEffect(() => {
    (async () => {
      await hide({ fade: true });
      setTimeout(() => void setAtBootsplash(false), HIDE_SPLASH_SCREEN_TIMEOUT);
    })();
  }, []);

  return (
    <GestureHandlerRootView style={AppStyles.root}>
      <AnalyticsProvider client={segmentClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <BiometryAvailabilityProvider>
              <HideBalanceProvider>
                <AppLockContextProvider>
                  <SafeAreaProvider>
                    <RootStackScreen atBootsplash={atBootsplash} />
                    <ToastProvider />
                  </SafeAreaProvider>
                </AppLockContextProvider>
              </HideBalanceProvider>
            </BiometryAvailabilityProvider>
          </PersistGate>
        </Provider>
      </AnalyticsProvider>
    </GestureHandlerRootView>
  );
};
