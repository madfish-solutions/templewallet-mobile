import { useEffect, useState } from 'react';
import { catchError, EMPTY, finalize } from 'rxjs';

import { fetchCollectiblesOfCollection$ } from 'src/apis/objkt';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';

const ERROR_MESSAGE = 'Sorry, something went wrong..';

export const useCollectionItemsLoading = (
  contract: string,
  selectedPublicKey: string,
  offset: number,
  galleryPk?: number
) => {
  const [collectibles, setCollectibles] = useState<CollectionItemInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const subscription = fetchCollectiblesOfCollection$(contract, selectedPublicKey, offset, galleryPk)
      .pipe(
        catchError(() => {
          showErrorToast({ description: ERROR_MESSAGE });

          return EMPTY;
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe(collectibles => setCollectibles(prev => [...prev, ...collectibles]));

    return () => subscription.unsubscribe();
  }, [offset]);

  return { collectibles, isLoading };
};
