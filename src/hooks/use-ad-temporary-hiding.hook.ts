import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { fetchEnableInternalHypelabAds } from 'src/apis/temple-wallet';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { hidePromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { usePromotionHidingTimestampSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { MS_IN_SECOND, SECONDS_IN_MINUTE } from 'src/utils/date.utils';

export const AD_HIDING_TIMEOUT = 12 * 3600 * 1000;

const shouldBeHiddenByTimeout = (hiddenAt: number) => {
  return Date.now() - hiddenAt < AD_HIDING_TIMEOUT;
};

export const useAdTemporaryHiding = (
  id: string,
  provider: PromotionProviderEnum,
  onHypelabAdsEnabled?: SyncFn<boolean>
) => {
  const { trackErrorEvent } = useAnalytics();
  const dispatch = useDispatch();
  const hiddenAt = usePromotionHidingTimestampSelector(id);
  const [isHiddenByTimeout, setIsHiddenByTimeout] = useState(shouldBeHiddenByTimeout(hiddenAt));

  useEffect(() => {
    const newIsHiddenByTimeout = shouldBeHiddenByTimeout(hiddenAt);
    setIsHiddenByTimeout(newIsHiddenByTimeout);

    if (newIsHiddenByTimeout) {
      const timeout = setTimeout(() => {
        setIsHiddenByTimeout(false);
      }, Math.max(Date.now() - hiddenAt + AD_HIDING_TIMEOUT, 0));

      return () => clearTimeout(timeout);
    }

    return;
  }, [hiddenAt]);

  const hidePromotion = useCallback(() => {
    dispatch(hidePromotionAction({ timestamp: Date.now(), id }));
  }, [id, dispatch]);

  const {
    data: enableInternalHypelabAds,
    isLoading: isLoadingEnableInternalHypelabAds,
    error: enableInternalHypelabAdsError
  } = useSWR<boolean>('enable-internal-hypelab-ads', fetchEnableInternalHypelabAds, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshInterval: (5 * SECONDS_IN_MINUTE + 1) * MS_IN_SECOND
  });
  const prevEnableInternalHypelabAdsRef = useRef(enableInternalHypelabAds);

  useEffect(() => {
    if (enableInternalHypelabAdsError) {
      trackErrorEvent('EnableInternalHypelabAdsError', enableInternalHypelabAdsError);
    }
  }, [enableInternalHypelabAdsError, trackErrorEvent]);

  const isHiddenTemporarily =
    isHiddenByTimeout ||
    (isLoadingEnableInternalHypelabAds &&
      enableInternalHypelabAds === undefined &&
      provider === PromotionProviderEnum.HypeLab);

  useEffect(() => {
    const prevEnableInternalHypelabAds = prevEnableInternalHypelabAdsRef.current;
    prevEnableInternalHypelabAdsRef.current = enableInternalHypelabAds;
    if (enableInternalHypelabAds === false && provider === PromotionProviderEnum.HypeLab) {
      onHypelabAdsEnabled?.(false);
    }
    if (prevEnableInternalHypelabAds === false && enableInternalHypelabAds) {
      onHypelabAdsEnabled?.(true);
    }
  }, [enableInternalHypelabAds, onHypelabAdsEnabled, provider]);

  return { isHiddenTemporarily, hidePromotion };
};
