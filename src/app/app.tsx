import 'react-native-url-polyfill/auto';

import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from 'src/biometry/biometry-availability.provider';
import { ErrorBoundary } from 'src/components/error-boundary';
import { HideBalanceProvider } from 'src/hooks/hide-balance/hide-balance.provider';
import { HideBootsplashProvider } from 'src/hooks/use-hide-bootsplash';
import { RootStackScreen } from 'src/navigator/root-stack';
import { AppLockContextProvider } from 'src/shelter/app-lock/app-lock';
import { persistor, store } from 'src/store';
import { TypographyProvider } from 'src/styles/typography.context';
import { ToastProvider } from 'src/toast/toast-provider';
import { initSentry } from 'src/utils/sentry.utils';

import { AppStyles } from './app.styles';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => (
  <GestureHandlerRootView style={AppStyles.root}>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BiometryAvailabilityProvider>
          <HideBalanceProvider>
            <AppLockContextProvider>
              <SafeAreaProvider>
                <TypographyProvider>
                  <HideBootsplashProvider>
                    <ErrorBoundary whileMessage="loading the app">
                      <RootStackScreen />
                    </ErrorBoundary>
                  </HideBootsplashProvider>
                  <ToastProvider />
                </TypographyProvider>
              </SafeAreaProvider>
            </AppLockContextProvider>
          </HideBalanceProvider>
        </BiometryAvailabilityProvider>
      </PersistGate>
    </Provider>
  </GestureHandlerRootView>
);
