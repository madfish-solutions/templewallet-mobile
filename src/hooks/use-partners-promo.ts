import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { PROMO_SYNC_INTERVAL } from 'src/config/fixed-times';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useAdTemporaryHiding } from './use-ad-temporary-hiding.hook';
import { useAuthorisedInterval } from './use-authed-interval';

export const useIsPartnersPromoShown = (id: string) => {
  const areAdsNotEnabled = useIsEnabledAdsBannerSelector();
  const isEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(id);

  return isEnabled && !areAdsNotEnabled && !isHiddenTemporarily;
};

export const usePartnersPromoLoad = (id: string) => {
  const promoIsShown = useIsPartnersPromoShown(id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (promoIsShown) {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
    }
  }, [dispatch, promoIsShown]);
};

export const usePartnersPromoSync = (id: string) => {
  const promoIsShown = useIsPartnersPromoShown(id);

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
