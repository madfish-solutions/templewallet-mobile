import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';

import { useAdTemporaryHiding } from './use-ad-temporary-hiding.hook';

export const useIsPartnersPromoShown = (id: string) => {
  const areAdsNotEnabled = useIsEnabledAdsBannerSelector();
  const isEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(id);

  return isEnabled && !areAdsNotEnabled && !isHiddenTemporarily;
};
