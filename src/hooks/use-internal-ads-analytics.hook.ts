import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { useElementIsSeen } from './use-element-is-seen.hook';

/**
 * This hook sends `Internal Ads Activity` after the ad is seen
 * @param page Page name
 * @param initialAdAreaIsVisible Whether the ad area is initially visible assuming that the screen is focused
 * @param seenTimeout If the element becomes visible and stays visible for this amount of time, it is considered seen.
 */
export const useInternalAdsAnalytics = (page: string, initialAdAreaIsVisible = false, seenTimeout = 200) => {
  const isFocused = useIsFocused();
  const { trackEvent } = useAnalytics();
  const [adAreaIsVisible, setAdAreaIsVisible] = useState(initialAdAreaIsVisible);
  const [loadedPromotionProvider, setLoadedPromotionProvider] = useState<PromotionProviderEnum | undefined>();
  const {
    isSeen: adIsSeen,
    resetIsSeen: resetAdIsSeen,
    clearSeenTimeout
  } = useElementIsSeen(adAreaIsVisible && isDefined(loadedPromotionProvider), seenTimeout);
  const prevAdIsSeenRef = useRef(adIsSeen);

  useEffect(() => {
    if (adIsSeen && !prevAdIsSeenRef.current) {
      trackEvent('Internal Ads Activity', AnalyticsEventCategory.General, {
        page,
        provider: loadedPromotionProvider
      });
    }
    prevAdIsSeenRef.current = adIsSeen;
  }, [adIsSeen, trackEvent, loadedPromotionProvider, page]);

  useEffect(() => void (!isFocused && setLoadedPromotionProvider(undefined)), [isFocused]);

  const resetAdState = useCallback(() => {
    setLoadedPromotionProvider(undefined);
    setAdAreaIsVisible(initialAdAreaIsVisible);
  }, [initialAdAreaIsVisible]);

  const onIsVisible = useCallback(
    (value: boolean) => {
      void (!value && clearSeenTimeout());
      setAdAreaIsVisible(value);
    },
    [clearSeenTimeout]
  );

  const onAdLoad = useCallback(
    (provider: PromotionProviderEnum) => {
      resetAdIsSeen();
      setLoadedPromotionProvider(provider);
    },
    [setLoadedPromotionProvider, resetAdIsSeen]
  );

  return { onAdLoad, resetAdState, onIsVisible };
};
