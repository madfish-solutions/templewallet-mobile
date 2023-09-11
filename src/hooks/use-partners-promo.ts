import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { PROMO_SYNC_INTERVAL } from 'src/config/fixed-times';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useAuthorisedInterval } from './use-interval.hook';

export const useIsPartnersPromoShown = () => {
  const areAdsNotEnabled = useIsEnabledAdsBannerSelector();
  const isEnabled = useIsPartnersPromoEnabledSelector();

  return isEnabled && !areAdsNotEnabled;
};

export const usePartnersPromoLoad = () => {
  const promoIsShown = useIsPartnersPromoShown();

  const dispatch = useDispatch();

  useEffect(() => {
    if (promoIsShown) {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
    }
  }, [promoIsShown]);
};

export const usePartnersPromoSync = () => {
  const promoIsShown = useIsPartnersPromoShown();

  const dispatch = useDispatch();

  useAuthorisedInterval(
    () => {
      if (promoIsShown) {
        dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
      }
    },
    PROMO_SYNC_INTERVAL,
    [promoIsShown]
  );
};
