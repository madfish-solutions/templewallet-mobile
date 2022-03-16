import { hide } from 'react-native-bootsplash';

// import { emptyFn } from '../config/general';
import { useAppStateStatus } from './use-app-state-status.hook';

export const useAppSplash = () => {
  const hideFn = () => {
    console.log('hide splash');
    // hide();
  };
  const hideFnBlur = () => {
    console.log('hide splash blur');
    hide();
  };
  useAppStateStatus(hideFn, hideFnBlur);

  return;
};
