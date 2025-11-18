import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';

import { useAdTemporaryHiding } from './use-ad-temporary-hiding.hook';

export const useIsPartnersPromoShown = (id: string, provider: PromotionProviderEnum) => {
  const isEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(id, provider);

  return isEnabled && !isHiddenTemporarily;
};
