import { useEffect, useState } from 'react';
import { catchError, EMPTY, finalize, map } from 'rxjs';

import { fetchCollectiblesOfCollection$ } from 'src/apis/objkt';
import { ObjktCollectionType } from 'src/apis/objkt/types';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';

const ERROR_MESSAGE = 'Sorry, something went wrong..';

export const useCollectionItemsLoading = (
  contract: string,
  selectedPublicKey: string,
  type: ObjktCollectionType,
  offset: number,
  galleryId?: string
) => {
  const [collectibles, setCollectibles] = useState<CollectionItemInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const subscription = fetchCollectiblesOfCollection$(contract, selectedPublicKey, type, offset, galleryId)
      .pipe(
        map(result => result),
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
