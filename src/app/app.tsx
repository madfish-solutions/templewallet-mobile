import React from 'react';
import { Button, LogBox, Text, View } from 'react-native';
import { hide } from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BiometryAvailabilityProvider } from '../biometry/biometry-availability.provider';
import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../config/animation';
import { HideBalanceProvider } from '../hooks/hide-balance/hide-balance.provider';
import { useDelayedEffect } from '../hooks/use-delayed-effect.hook';
import { ScreensEnum } from '../navigator/enums/screens.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { RootStackScreen } from '../navigator/root-stack';
import { useAppLock } from '../shelter/use-app-lock.hook';
import { useShelter } from '../shelter/use-shelter.hook';
import { rootStateResetAction } from '../store/root-state.actions';
import { persistor, store } from '../store/store';
import { ToastProvider } from '../toast/toast-provider';
import { initSentry } from '../utils/sentry.utils';

initSentry();
enableScreens();
LogBox.ignoreAllLogs();

export const App = () => {
  useDelayedEffect(HIDE_SPLASH_SCREEN_TIMEOUT, () => void hide({ fade: true }), []);
  const dispatch = store.dispatch;
  const { importWallet } = useShelter();
  const { unlock } = useAppLock();
  const { navigate } = useNavigation();

  const fillStorage = () => {
    dispatch(rootStateResetAction.submit());
    // console.log(`context is: ${account}`);
    const getEnv = (key: string): string => process.env[key] ?? '';

    const appPassword = getEnv('E2E_APP_PASSWORD');
    const seedPhrase = getEnv('E2E_SEED_PHRASE');
    importWallet({
      password: appPassword,
      seedPhrase: seedPhrase
    });
    unlock(appPassword);
    navigate(ScreensEnum.Wallet);
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BiometryAvailabilityProvider>
          <HideBalanceProvider>
            <SafeAreaProvider>
              {process.env.NODE_ENV === 'development' && (
                <View>
                  {/* <Button onPress={() => resetStorage()} testID="resetStorageBtn">
                    <Text>Reset storage</Text>
                  </Button> */}
                  <Button title={'fill storage'} onPress={() => fillStorage()} testID="fillStorageButton">
                    <Text>Fill storage</Text>
                  </Button>
                </View>
              )}
              <RootStackScreen />
              <ToastProvider />
            </SafeAreaProvider>
          </HideBalanceProvider>
        </BiometryAvailabilityProvider>
      </PersistGate>
    </Provider>
  );
};
