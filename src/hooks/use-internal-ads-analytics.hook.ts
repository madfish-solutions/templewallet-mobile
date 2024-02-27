import { throttle } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getIntersectionRatio } from 'src/utils/get-intersection-ratio';
import { isDefined } from 'src/utils/is-defined';

import { useElementIsSeen } from './use-element-is-seen.hook';
import { DEFAULT_INTERSECTION_THRESHOLD, Refs, useIntersectionObservation } from './use-intersection-observation.hook';

const DEFAULT_OUTSIDE_OF_SCROLL_AD_OFFSET = { x: 0, y: 0 };

/**
 * This hook sends `Internal Ads Activity` once after the ad is seen
 * @param page Page name
 * @param refs If specified, the measurement of the ad element will be relative to `parent`; otherwise, the data from
 * events will be used
 * @param outsideOfScrollAdOffset Specify this value if the ad is not in a scroll view but has offset which is not
 * detected by measuring layout
 * @returns Callbacks for the ad element and the list which contains it if applicable
 */
export const useInternalAdsAnalytics = (
  page: string,
  refs?: Refs,
  outsideOfScrollAdOffset = DEFAULT_OUTSIDE_OF_SCROLL_AD_OFFSET,
  seenTimeout = 200
) => {
  const { trackEvent } = useAnalytics();
  const [adAreaIsVisible, setAdAreaIsVisible] = useState(false);
  const [loadedPromotionProvider, setLoadedPromotionProvider] = useState<PromotionProviderEnum | undefined>();
  const { isSeen: adIsSeen, resetIsSeen: resetAdIsSeen } = useElementIsSeen(
    adAreaIsVisible && isDefined(loadedPromotionProvider),
    seenTimeout
  );
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

  const refreshOutsideOfScrollAdVisible = useCallback(() => {
    const { x: offsetX, y: offsetY } = outsideOfScrollAdOffset;
    const element = refs?.element.current;
    const parent = refs?.parent.current;

    if (!element || !parent) {
      return;
    }

    element.measureLayout(
      parent,
      (x, y, width, height) => {
        parent.measure((_, _2, parentWidth, parentHeight) => {
          setAdAreaIsVisible(
            getIntersectionRatio(
              { width: parentWidth, height: parentHeight },
              { x: x + offsetX, y: y + offsetY, width, height }
            ) >= DEFAULT_INTERSECTION_THRESHOLD
          );
        });
      },
      () => {
        console.error('Failed to measure layout of the ad element relatively to the parent');
      }
    );
  }, [refs, outsideOfScrollAdOffset]);

  const handleOutsideOfScrollAdOffset = useMemo(
    () => throttle(() => refreshOutsideOfScrollAdVisible(), 100, { leading: false, trailing: true }),
    [refreshOutsideOfScrollAdVisible]
  );
  useEffect(handleOutsideOfScrollAdOffset, [handleOutsideOfScrollAdOffset]);

  const onOutsideOfScrollAdLayout = useCallback(
    (e: LayoutChangeEvent) => {
      e.persist();
      const element = refs?.element.current;
      const parent = refs?.parent.current;
      if (element && parent) {
        refreshOutsideOfScrollAdVisible();
      } else if (!refs) {
        setAdAreaIsVisible(true);
      }
    },
    [refreshOutsideOfScrollAdVisible, refs]
  );

  const resetAdState = useCallback(() => {
    setAdAreaIsVisible(false);
    setLoadedPromotionProvider(undefined);
  }, []);

  const onAdLoad = useCallback(
    (provider: PromotionProviderEnum) => {
      resetAdIsSeen();
      setLoadedPromotionProvider(provider);
    },
    [setLoadedPromotionProvider, resetAdIsSeen]
  );

  const {
    onListScroll,
    onElementLayoutChange: onInsideScrollAdLayout,
    onListLayoutChange
  } = useIntersectionObservation(setAdAreaIsVisible, refs);

  return {
    onListScroll,
    onInsideScrollAdLayout,
    onListLayoutChange,
    onOutsideOfScrollAdLayout,
    onAdLoad,
    resetAdState
  };
};
