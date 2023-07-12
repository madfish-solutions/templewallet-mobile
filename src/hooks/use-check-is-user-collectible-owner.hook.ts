import { useMemo } from 'react';

import { useCollectiblesListSelector } from '../store/wallet/wallet-selectors';
import { getTokenSlug } from '../token/utils/token.utils';

export const useCollectibleOwnerCheck = (slug: string) => {
  const collectibles = useCollectiblesListSelector();

  const isUserOwnerCurrentCollectible = useMemo(
    () => Boolean(collectibles.find(ownCollectible => getTokenSlug(ownCollectible) === slug)),
    [slug, collectibles]
  );

  return isUserOwnerCurrentCollectible;
};
