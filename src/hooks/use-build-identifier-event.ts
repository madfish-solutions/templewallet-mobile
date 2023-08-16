import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsApkBuildLaunchEventFired } from 'src/store/settings/settings-actions';
import { useIsApkBuildLaunchEventFiredSelector } from 'src/store/settings/settings-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { TEMPLE_BUILD_IDENTIFIER } from 'src/utils/env.utils';
import { isString } from 'src/utils/is-string';

export const useBuildIdentifierEvent = () => {
  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();
  const isApkBuildLaunchEventFired = useIsApkBuildLaunchEventFiredSelector();

  useEffect(() => {
    if (!isApkBuildLaunchEventFired && isString(TEMPLE_BUILD_IDENTIFIER)) {
      trackEvent('APK_BUILD_LAUNCH', AnalyticsEventCategory.General, {
        buildId: TEMPLE_BUILD_IDENTIFIER
      });
      dispatch(setIsApkBuildLaunchEventFired(true));
    }
  }, []);
};
