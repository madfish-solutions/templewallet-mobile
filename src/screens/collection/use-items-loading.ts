import { useCallback, useState } from 'react';

import { fetchCollectiblesOfCollection } from 'src/apis/objkt';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { useDidMount } from 'src/utils/hooks/use-did-mount';

export const useCollectionItemsLoading = (contract: string, accountPkh: string, galleryPk?: number) => {
  const [collectibles, setCollectibles] = useState<CollectionItemInterface[]>([]);
  const [reachedTheEnd, setReachedTheEnd] = useState(false);
  const [collectionSize, setCollectionSize] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const { trackErrorEvent } = useAnalytics();

  const loadMore = useCallback(() => {
    if (reachedTheEnd || isLoading) {
      return;
    }

    setIsLoading(true);

    fetchCollectiblesOfCollection(contract, accountPkh, collectibles.length, galleryPk)
      .then(
        ({ items, collectionSize: newCollectionSize, reachedTheEnd }) => {
          setCollectionSize(newCollectionSize);

          if (reachedTheEnd) {
            setReachedTheEnd(true);
          }

          if (items.length) setCollectibles(current => [...current, ...items]);
        },
        error => {
          console.error(error);
          trackErrorEvent('LoadMoreCollectionItemsError', error, [accountPkh], {
            contract,
            galleryPk,
            offset: collectibles.length
          });
          showErrorToast({ description: 'Failed to load collection items' });
        }
      )
      .finally(() => setIsLoading(false));
  }, [reachedTheEnd, isLoading, collectibles.length, trackErrorEvent]);

  useDidMount(loadMore);

  return { collectibles, isLoading, collectionSize, loadMore };
};
