import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { isPinOrFingerprintSet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { isAndroid } from '../config/system';
// import { resetApplicationAction } from '../store/root-state.actions';
import { setIsPasscode } from '../store/settings/settings-actions';

export const useAndroidPasscode = () => {
  const dispatch = useDispatch();
  // // const [passwordLock, setPasswordLock] = useState<null | boolean>(null);

  const appState = useRef(AppState.currentState);
  // // const [, setAppStateVisible] = useState(appState.current);

  const isPinOrFingerPrintHandler = useCallback((isPinOrFingerprintSet: boolean) => {
    if (!isPinOrFingerprintSet) {
      if (!isAndroid) {
        console.log('// dispatch(setIsPasscode(false));');
        // dispatch(setIsPasscode(false));
      }
      console.log('// dispatch(resetApplicationAction.submit());');
      // dispatch(resetApplicationAction.submit());
    } else {
      console.log('// dispatch(setIsPasscode(true));');
      dispatch(setIsPasscode(true));
    }
  }, []);

  useEffect(() => {
    isPinOrFingerprintSet().then(isPinOrFingerPrintHandler);
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      }

      appState.current = nextAppState;
      // // setAppStateVisible(appState.current);
      isPinOrFingerprintSet().then(isPinOrFingerPrintHandler);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return;
  // // return { passwordLock };
};
