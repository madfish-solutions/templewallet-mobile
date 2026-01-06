import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SpInAppUpdates from 'sp-react-native-in-app-updates';

import { setIsInAppUpdateAvailableAction } from 'src/store/settings/settings-actions';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

export const useInAppUpdate = () => {
  const { trackErrorEvent } = useAnalytics();
  const dispatch = useDispatch();

  const checkForUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(false);
    try {
      const { shouldUpdate } = await inAppUpdates.checkNeedsUpdate();

      dispatch(setIsInAppUpdateAvailableAction(shouldUpdate));
    } catch (error) {
      trackErrorEvent('InAppUpdateError', error, []);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);
};
