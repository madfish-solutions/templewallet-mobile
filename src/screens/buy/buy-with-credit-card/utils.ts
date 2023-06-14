import { PairLimitsRecord } from 'src/store/buy-with-credit-card/state';
import { isDefined } from 'src/utils/is-defined';
import { mergeAssetsLimits } from 'src/utils/pair-limits';

export const mergeProvidersLimits = (limits: PairLimitsRecord | undefined) => {
  if (!isDefined(limits)) {
    return {};
  }

  const limitsArray = Object.values(limits).map(item => item.data);

  return mergeAssetsLimits(limitsArray);
};
