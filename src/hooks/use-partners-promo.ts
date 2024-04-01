import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';

import { useAdTemporaryHiding } from './use-ad-temporary-hiding.hook';

export const useIsPartnersPromoShown = (id: string) => {
  const isEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily } = useAdTemporaryHiding(id);

  return isEnabled && !isHiddenTemporarily;
};
