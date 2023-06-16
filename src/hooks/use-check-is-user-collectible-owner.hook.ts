import { useMemo } from 'react';

import { useCollectiblesListSelector } from '../store/wallet/wallet-selectors';
import { TokenInterface } from '../token/interfaces/token.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export const useCollectibleOwnerCheck = (collectible: TokenInterface) => {
  const collectibles = useCollectiblesListSelector();

  const isUserOwnerCurrentCollectible = useMemo(
    () => Boolean(collectibles.find(ownCollectible => getTokenSlug(ownCollectible) === getTokenSlug(collectible))),
    [collectible, collectibles]
  );

  return isUserOwnerCurrentCollectible;
};
