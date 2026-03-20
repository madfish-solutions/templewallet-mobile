import { getRoute3TokenBySlug } from 'src/utils/route3.util';

import { useSelector } from '../selector';

export const useSwapParamsSelector = () => useSelector(state => state.swap.swapParams);
export const useSwapTokensMetadataSelector = () => useSelector(state => state.swap.tokensMetadata);
export const useSwapTokensSelector = () => useSelector(state => state.swap.tokens);
export const useSwapTokenBySlugSelector = (slug: string) =>
  useSelector(state => getRoute3TokenBySlug(state.swap.tokens.data, slug));
// TODO: use this selector to display a route
/**
 * A selector for dexes that are available for swap.
 * @knipignore
 */
export const useSwapDexesSelector = () => useSelector(state => state.swap.dexes);
