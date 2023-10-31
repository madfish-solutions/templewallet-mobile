import { useDispatch } from 'react-redux';

import { PROMO_SYNC_INTERVAL } from 'src/config/fixed-times';
import {
  loadPartnersPromoActions,
  loadPartnersTextPromoActions
} from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';

import { useAuthorisedInterval } from './use-authed-interval';

export const useIsPartnersPromoShown = () => {
  const areAdsNotEnabled = useIsEnabledAdsBannerSelector();
  const isEnabled = useIsPartnersPromoEnabledSelector();

  return isEnabled && !areAdsNotEnabled;
};

export const usePartnersPromoSync = () => {
  const promoIsShown = useIsPartnersPromoShown();

  const dispatch = useDispatch();

  useAuthorisedInterval(
    () => {
      if (promoIsShown) {
        dispatch(loadPartnersTextPromoActions.submit());
        dispatch(loadPartnersPromoActions.submit());
      }
    },
    PROMO_SYNC_INTERVAL,
    [promoIsShown]
  );
};
