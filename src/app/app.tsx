import React, { useEffect } from 'react';
import { hide } from 'react-native-bootsplash';
import QuickActions from 'react-native-quick-actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { RootStackScreen } from '../navigator/root-stack';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { HideBalanceProvider } from '../utils/hide-balance/hide-balance.provider';
import { initQuickActions } from '../utils/quick-actions.utils';
import { initSentry } from '../utils/sentry.utils';

initSentry();
enableScreens();
initQuickActions();

export const App = () => {
  useEffect(() => {
    void hide();

    return () => QuickActions.clearShortcutItems();
  }, []);

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
