import { isNonEmptyArray } from '@apollo/client/utilities';
import { useEffect, useState } from 'react';
import { EMPTY } from 'rxjs';
import { map, tap, finalize, catchError } from 'rxjs/operators';

import { CollectibleAttributes, CollectibleInfo } from '../interfaces/collectible-info.interface';
import { BLURED_COLLECTIBLE_ATTRIBUTE_NAME } from '../modals/collectible-modal/constants';
import { getAttributesInfo$, getAttributesWithRarity } from '../utils/collectible-info.utils';

export const useFetchCollectibleAttributes = (collectibleInfo: CollectibleInfo) => {
  const initialAttributes = collectibleInfo.attributes.filter(
    item => item.attribute.name !== BLURED_COLLECTIBLE_ATTRIBUTE_NAME
  );

  const [attributes, setAttributes] = useState<CollectibleAttributes[]>(initialAttributes);
  const [isLoading, setIsLoading] = useState(false);

  const attributeIds = initialAttributes.map(({ attribute }) => attribute.id);
  const isGallery = isNonEmptyArray(collectibleInfo.galleries);

  useEffect(() => {
    if (!isNonEmptyArray(initialAttributes)) {
      return;
    }

    const subscription = getAttributesInfo$(attributeIds, isGallery)
      .pipe(
        tap(() => setIsLoading(true)),
        map(attributesInfo => getAttributesWithRarity(attributesInfo, collectibleInfo)),
        catchError(() => EMPTY),
        finalize(() => setIsLoading(false))
      )
      .subscribe(result => {
        setAttributes(result);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { attributes, isLoading };
};
