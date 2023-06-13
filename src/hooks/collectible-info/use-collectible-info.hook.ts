import { isNonEmptyArray } from '@apollo/client/utilities';
import { useEffect, useState } from 'react';
import { EMPTY, of } from 'rxjs';
import { map, tap, finalize, catchError, switchMap } from 'rxjs/operators';

import { fetchCollectibleInfo$ } from 'src/apis/objkt/index';

import { CollectibleInfo } from '../../interfaces/collectible-info.interface';
import { getAttributesInfo$, getAttributesWithRarity } from './collectible-info.utils';
import { collectibleInfoInitialState } from './constants';

export const useCollectibleInfo = (address: string, id: string) => {
  const [collectibleInfo, setCollectibleInfo] = useState<CollectibleInfo>(collectibleInfoInitialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = fetchCollectibleInfo$(address, id)
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(collectibleInfo => {
          if (!isNonEmptyArray(collectibleInfo.attributes)) {
            return of(collectibleInfo);
          }

          const attributeIds = collectibleInfo.attributes.map(({ attribute }) => attribute.id);

          return getAttributesInfo$(attributeIds, isNonEmptyArray(collectibleInfo.galleries)).pipe(
            map(attributesInfo => {
              return {
                ...collectibleInfo,
                attributes: getAttributesWithRarity(attributesInfo, collectibleInfo)
              };
            })
          );
        }),
        catchError(() => EMPTY),
        finalize(() => setIsLoading(false))
      )
      .subscribe(result => {
        setCollectibleInfo(result);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { collectibleInfo, isLoading };
};
