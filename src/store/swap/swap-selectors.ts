import { Route3Token } from 'src/interfaces/route3.interface';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { useSelector } from '../selector';

export const getRoute3TokenBySlug = (route3Tokens: Array<Route3Token>, slug: string | undefined) => {
  if (slug === TEZ_TOKEN_SLUG) {
    return route3Tokens.find(({ contract }) => contract === null);
  }

  return route3Tokens.find(({ contract, tokenId }) => toTokenSlug(contract ?? '', tokenId ?? 0) === slug);
};

export const useSwapTokensSelector = () => useSelector(state => state.swap.tokens);
export const useSwapTokensMetadataSelector = () => useSelector(state => state.swap.tokensMetadata);
export const useSwapTokenBySlugSelector = (slug: string) =>
  useSelector(state => getRoute3TokenBySlug(state.swap.tokens.data, slug));
export const useSwapDexesSelector = () => useSelector(state => state.swap.dexes);
