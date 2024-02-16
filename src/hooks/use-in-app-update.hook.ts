import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SpInAppUpdates from 'sp-react-native-in-app-updates';

import { setIsInAppUpdateAvailableAction } from 'src/store/settings/settings-actions';

export const useInAppUpdate = () => {
  const dispatch = useDispatch();

  const checkForUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(false);
    const { shouldUpdate } = await inAppUpdates.checkNeedsUpdate();

    dispatch(setIsInAppUpdateAvailableAction(shouldUpdate));
  };

  useEffect(() => {
    checkForUpdate();
  }, []);
};
