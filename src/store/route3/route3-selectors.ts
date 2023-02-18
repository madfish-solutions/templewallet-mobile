import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { useSelector } from '../selector';

export const useRoute3TokensSelector = () => useSelector(state => state.route3.tokens);
export const useRoute3TokensSlugsSelector = () =>
  useSelector(state =>
    state.route3.tokens.data.map(({ contract, tokenId }) =>
      toTokenSlug(contract ?? emptyTokenMetadata.address, tokenId ?? emptyTokenMetadata.id)
    )
  );
export const useRoute3SwapParamsSelector = () => useSelector(state => state.route3.swapParams);
export const useRoute3DexesSelector = () => useSelector(state => state.route3.dexes);
