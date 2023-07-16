import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadCollectibleDetailsActions } from '../store/collectibles/collectibles-actions';
import { useCollectibleDetailsSelector } from '../store/collectibles/collectibles-selectors';
import { useCollectibleSelector } from '../store/wallet/wallet-selectors';
import { fromTokenSlug } from '../utils/from-token-slug';

export const useCurrentCollectibleFullData = (slug: string, isUserOwnerCollectible: boolean) => {
  const dispatch = useDispatch();

  const collectibleMetadata = useCollectibleSelector(slug);
  const collectibleDetails = useCollectibleDetailsSelector(slug);

  const [address, id] = fromTokenSlug(slug);

  useEffect(() => {
    if (!isUserOwnerCollectible) {
      dispatch(loadCollectibleDetailsActions.submit({ address, id }));
    }
  }, [slug, isUserOwnerCollectible]);

  return { collectible: { ...collectibleMetadata, ...collectibleDetails } };
};
