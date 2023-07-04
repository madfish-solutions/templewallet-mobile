import { useMemo } from 'react';

import { useCollectiblesDetailsSelector } from '../store/collectibles/collectibles-selectors';
import { useCollectiblesListSelector } from '../store/wallet/wallet-selectors';
import { CollectibleInterface } from '../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export const useCollectiblesWithFullData = (): CollectibleInterface[] => {
  const collectiblesFromStore = useCollectiblesListSelector();
  const collectiblesDetails = useCollectiblesDetailsSelector();

  return useMemo(
    () =>
      collectiblesFromStore.map(collectibleFromStore => {
        const collectibleSlug = getTokenSlug({ address: collectibleFromStore.address, id: collectibleFromStore.id });

        return {
          ...collectibleFromStore,
          ...collectiblesDetails[collectibleSlug]
        };
      }),
    [collectiblesFromStore, collectiblesDetails]
  );
};
