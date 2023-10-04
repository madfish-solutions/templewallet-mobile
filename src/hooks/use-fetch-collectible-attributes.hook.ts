import { isNonEmptyArray } from '@apollo/client/utilities';
import { useEffect, useState } from 'react';
import { EMPTY } from 'rxjs';
import { map, tap, finalize, catchError } from 'rxjs/operators';

import { HIDDEN_ATTRIBUTES_NAME } from 'src/apis/objkt/constants';

import { CollectibleAttributes } from '../apis/objkt/types';
import { CollectibleDetailsInterface } from '../token/interfaces/collectible-interfaces.interface';
import { getAttributesInfo$, getAttributesWithRarity } from '../utils/collectibles.utils';

export const useFetchCollectibleAttributes = (details: CollectibleDetailsInterface) => {
  const initialAttributes = isNonEmptyArray(details.attributes)
    ? details.attributes.filter(item => !HIDDEN_ATTRIBUTES_NAME.includes(item.attribute.name))
    : [];

  const [attributes, setAttributes] = useState<CollectibleAttributes[]>(initialAttributes);
  const [isLoading, setIsLoading] = useState(false);

  const attributeIds = initialAttributes.map(({ attribute }) => attribute.id);
  const isGallery = isNonEmptyArray(details.galleries);

  useEffect(() => {
    if (!isNonEmptyArray(initialAttributes)) {
      return;
    }

    const subscription = getAttributesInfo$(attributeIds, isGallery)
      .pipe(
        tap(() => setIsLoading(true)),
        map(attributesInfo => getAttributesWithRarity(attributesInfo, details)),
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
