import { AnalyticsProvider } from '@segment/analytics-react-native';
import React from 'react';
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
import { useDelayedEffect } from '../hooks/use-delayed-effect.hook';
import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { segmentClient } from '../utils/analytics/analytics.util';
import { initSentry } from '../utils/sentry.utils';
import { AppStyles } from './app.styles';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => {
  useDelayedEffect(HIDE_SPLASH_SCREEN_TIMEOUT, () => void hide({ fade: true }), []);

  return (
    <GestureHandlerRootView style={AppStyles.root}>
      <AnalyticsProvider client={segmentClient}>
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
      </AnalyticsProvider>
    </GestureHandlerRootView>
  );
};
