import { isNonEmptyArray } from '@apollo/client/utilities';
import { useEffect, useState } from 'react';
import { EMPTY } from 'rxjs';
import { map, tap, finalize, catchError } from 'rxjs/operators';

import { CollectibleAttributes } from '../apis/objkt/types';
import { BLURED_COLLECTIBLE_ATTRIBUTE_NAME } from '../modals/collectible-modal/constants';
import { CollectibleInterface } from '../token/interfaces/collectible-interfaces.interface';
import { getAttributesInfo$, getAttributesWithRarity } from '../utils/collectibles.utils';

export const useFetchCollectibleAttributes = (collectible: CollectibleInterface) => {
  const initialAttributes = collectible.attributes.filter(
    item => item.attribute.name !== BLURED_COLLECTIBLE_ATTRIBUTE_NAME
  );

  const [attributes, setAttributes] = useState<CollectibleAttributes[]>(initialAttributes);
  const [isLoading, setIsLoading] = useState(false);

  const attributeIds = initialAttributes.map(({ attribute }) => attribute.id);
  const isGallery = isNonEmptyArray(collectible.galleries);

  useEffect(() => {
    if (!isNonEmptyArray(initialAttributes)) {
      return;
    }

    const subscription = getAttributesInfo$(attributeIds, isGallery)
      .pipe(
        tap(() => setIsLoading(true)),
        map(attributesInfo => getAttributesWithRarity(attributesInfo, collectible)),
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
