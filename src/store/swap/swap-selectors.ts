import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { useSelector } from '../selector';

export const useSwapTokensSelector = () => useSelector(state => state.swap.tokens);
export const useSwapTokensSlugsSelector = () =>
  useSelector(state =>
    state.swap.tokens.data.map(({ contract, tokenId }) =>
      toTokenSlug(contract ?? emptyTokenMetadata.address, tokenId ?? emptyTokenMetadata.id)
    )
  );
export const useSwapParamsSelector = () => useSelector(state => state.swap.swapParams);
export const useSwapDexesSelector = () => useSelector(state => state.swap.dexes);
export const useSwapContractSelector = () => useSelector(state => state.swap.swapContract);
