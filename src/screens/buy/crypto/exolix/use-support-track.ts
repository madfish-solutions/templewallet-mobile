import { useCallback } from 'react';

import { useExolixStep } from '../../../../store/exolix/exolix-selectors';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { ExolixSelectors } from './exolix.selectors';

export const useSupportTrack = () => {
  const step = useExolixStep();
  const { trackEvent } = useAnalytics();

  const handleTrackSupportSubmit = useCallback(() => {
    let event: ExolixSelectors;
    switch (step) {
      case 2:
        event = ExolixSelectors.TopupSecondStepSupport;
        break;
      case 3:
        event = ExolixSelectors.TopupThirdStepSupport;
        break;
      default:
        event = ExolixSelectors.TopupFourthStepSubmit;
        break;
    }

    return trackEvent(event, AnalyticsEventCategory.ButtonPress);
  }, [step, trackEvent]);

  return handleTrackSupportSubmit;
};
