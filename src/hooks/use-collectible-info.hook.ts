import { isNonEmptyArray } from '@apollo/client/utilities';
import { useEffect, useState } from 'react';
import { EMPTY, Observable, of } from 'rxjs';
import { map, tap, finalize, catchError, switchMap } from 'rxjs/operators';

import { fetchCollectibleInfo$, fetchFA2AttributeCount$, fetchGalleryAttributeCount$ } from 'src/apis/objkt/index';

import { AttributeInfo } from '../interfaces/attribute.interface';
import { CollectibleInfo } from '../interfaces/collectible-info.interface';
import { showErrorToast } from '../toast/toast.utils';

const initialState: CollectibleInfo = {
  description: '',
  creators: [],
  fa: {
    name: '',
    logo: '',
    items: 0
  },
  metadata: '',
  artifact_uri: '',
  attributes: [],
  timestamp: '',
  royalties: [],
  supply: 0,
  galleries: []
};

const attributesInfoInitialState: AttributeInfo[] = [
  {
    attribute_id: 0,
    tokens: 0
  }
];

export const useCollectibleInfo = (address: string, id: string) => {
  const [collectibleInfo, setCollectibleInfo] = useState<CollectibleInfo>(initialState);
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
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        }),
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

const getAttributesInfo$ = (ids: number[], isGallery: boolean): Observable<AttributeInfo[]> => {
  if (isGallery) {
    return fetchGalleryAttributeCount$(ids).pipe(
      map(result => result),
      catchError(() => of(attributesInfoInitialState))
    );
  }

  return fetchFA2AttributeCount$(ids).pipe(
    map(result => result),
    catchError(() => of(attributesInfoInitialState))
  );
};

const getAttributesWithRarity = (attributesInfo: AttributeInfo[], collectibleInfo: CollectibleInfo) => {
  const isExistGallery = isNonEmptyArray(collectibleInfo.galleries);
  const collectibleCalleryCount = isExistGallery
    ? collectibleInfo.galleries[0].gallery.items
    : collectibleInfo.fa.items;

  return collectibleInfo.attributes.map(({ attribute }) => {
    const attributeTokenCount = attributesInfo.find(el => el.attribute_id === attribute.id)?.tokens ?? 1;
    const calculateRarity = ((attributeTokenCount / collectibleCalleryCount) * 100).toFixed(2);

    return {
      attribute: {
        id: attribute.id,
        name: attribute.name,
        value: attribute.value,
        rarity: Number(calculateRarity)
      }
    };
  });
};
