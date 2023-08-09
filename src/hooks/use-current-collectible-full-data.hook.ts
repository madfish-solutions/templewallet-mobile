import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadCollectiblesDetailsActions } from '../store/collectibles/collectibles-actions';
import { useCollectibleDetailsSelector } from '../store/collectibles/collectibles-selectors';
import { useCollectibleSelector } from '../store/wallet/wallet-selectors';

export const useCurrentCollectibleFullData = (slug: string, isUserOwnerCollectible: boolean) => {
  const dispatch = useDispatch();

  const collectibleMetadata = useCollectibleSelector(slug);
  const collectibleDetails = useCollectibleDetailsSelector(slug);

  useEffect(() => {
    if (!isUserOwnerCollectible) {
      dispatch(loadCollectiblesDetailsActions.submit([slug]));
    }
  }, [slug, isUserOwnerCollectible]);

  return { collectible: { ...collectibleMetadata, ...collectibleDetails } };
};
