import { PairLimitsRecord } from 'src/store/buy-with-credit-card/state';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/store/buy-with-credit-card/types';
import { isDefined } from 'src/utils/is-defined';
import { mergeAssetsLimits } from 'src/utils/pair-limits';

export const mergeProvidersLimits = (limits: PairLimitsRecord | undefined) => {
  if (!isDefined(limits)) {
    return {};
  }

  const limitsArray = Object.values(limits).map(item => item.data);

  return mergeAssetsLimits(limitsArray);
};

const isTopUpOutputAsset = (asset: TopUpInputInterface): asset is TopUpOutputInterface =>
  'slug' in asset && typeof asset.slug === 'string';

export const getTopUpOutputAsset = (asset: TopUpInputInterface): TopUpOutputInterface => {
  if (!isTopUpOutputAsset(asset)) {
    throw new Error('The selected output asset has no token slug');
  }

  return asset;
};
