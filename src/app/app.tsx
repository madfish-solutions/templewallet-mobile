import { AnalyticsProvider } from '@segment/analytics-react-native';
import React from 'react';
import { LogBox } from 'react-native';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../config/animation';
import { HideBalanceProvider } from '../hooks/hide-balance/hide-balance.provider';
import { SlippageToleranceProvider } from '../hooks/slippage-tolerance/slippage-tolerance.provider';
import { useDelayedEffect } from '../hooks/use-delayed-effect.hook';
import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { segmentClient } from '../utils/analytics/analytics.util';
import { initSentry } from '../utils/sentry.utils';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => {
  useDelayedEffect(HIDE_SPLASH_SCREEN_TIMEOUT, () => void hide({ fade: true }), []);

  return (
    <AnalyticsProvider client={segmentClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <BiometryAvailabilityProvider>
            <HideBalanceProvider>
              <SlippageToleranceProvider>
                <SafeAreaProvider>
                  <RootStackScreen />
                  <ToastProvider />
                </SafeAreaProvider>
              </SlippageToleranceProvider>
            </HideBalanceProvider>
          </BiometryAvailabilityProvider>
        </PersistGate>
      </Provider>
    </AnalyticsProvider>
  );
};
