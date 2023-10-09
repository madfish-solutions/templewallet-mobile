import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';

import { useCollectiblesDetailsSelector } from '../store/collectibles/collectibles-selectors';
import { useCollectiblesListSelector } from '../store/wallet/wallet-selectors';
import { CollectibleInterface } from '../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../token/utils/token.utils';

/** @deprecated // Flawed logic ! */
export const useCollectiblesWithFullData = (): CollectibleInterface[] => {
  const collectiblesFromStore = useCollectiblesListSelector();
  const collectiblesDetails = useCollectiblesDetailsSelector();

  return useMemo(
    () =>
      collectiblesFromStore
        .filter(collectible => collectible.visibility === VisibilityEnum.Visible)
        .map(collectibleFromStore => {
          const collectibleSlug = getTokenSlug({ address: collectibleFromStore.address, id: collectibleFromStore.id });

          return {
            ...collectiblesDetails[collectibleSlug]!,
            ...collectibleFromStore
          };
        }),
    [collectiblesFromStore, collectiblesDetails]
  );
};
