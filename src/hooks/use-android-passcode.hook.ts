import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { setIsPasscode } from '../store/settings/settings-actions';

export const useAndroidPasscode = () => {
  const dispatch = useDispatch();

  const appState = useRef(AppState.currentState);

  const isPinOrFingerPrintHandler = useCallback((isPinOrFingerprintSet: boolean) => {
    if (!isPinOrFingerprintSet) {
      dispatch(setIsPasscode(false));
    } else {
      dispatch(setIsPasscode(true));
    }
  }, []);

  useEffect(() => {
    isPinOrFingerprintSet().then(isPinOrFingerPrintHandler);
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      }

      appState.current = nextAppState;
      isPinOrFingerprintSet().then(isPinOrFingerPrintHandler);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return;
};
