import { useEffect, useState } from 'react';
import { catchError, EMPTY, finalize, map } from 'rxjs';

import { fetchCollectiblesByCollection$ } from 'src/apis/objkt';
import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { showErrorToast } from 'src/toast/error-toast.utils';

import { CollectibleOfferInteface } from '../token/interfaces/collectible-interfaces.interface';

const ERROR_MESSAGE = 'Sorry, something went wrong..';

export const useCollectibleByCollectionInfo = (
  contract: string,
  selectedPublicKey: string,
  type: ObjktTypeEnum,
  offset: number,
  galleryId?: string
) => {
  const [collectibles, setCollectibles] = useState<CollectibleOfferInteface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const subscription = fetchCollectiblesByCollection$(contract, selectedPublicKey, type, offset, galleryId)
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
