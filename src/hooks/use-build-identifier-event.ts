import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsBuildIdentifierEventFiredOnceAction } from 'src/store/settings/settings-actions';
import { useIsBuildIdentifierEventFiredOnceSelector } from 'src/store/settings/settings-selectors';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { TEMPLE_BUILD_IDENTIFIER_EVENT } from 'src/utils/env.utils';
import { isString } from 'src/utils/is-string';

export const useBuildIdentifierEvent = () => {
  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();
  const isBuildIdentifierEventFiredOnce = useIsBuildIdentifierEventFiredOnceSelector();

  useEffect(() => {
    if (!isBuildIdentifierEventFiredOnce && isString(TEMPLE_BUILD_IDENTIFIER_EVENT)) {
      trackEvent(TEMPLE_BUILD_IDENTIFIER_EVENT);
      dispatch(setIsBuildIdentifierEventFiredOnceAction(true));
    }
  }, []);
};
