import { isNonEmptyArray } from '@apollo/client/utilities';
import { Observable, catchError, map, of } from 'rxjs';

import { fetchGalleryAttributeCount$, fetchFA2AttributeCount$ } from '../../apis/objkt/index';
import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo } from '../../interfaces/collectible-info.interface';
import { attributesInfoInitialState } from './constants';

export const getAttributesWithRarity = (attributesInfo: AttributeInfo[], collectibleInfo: CollectibleInfo) => {
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

export const getAttributesInfo$ = (ids: number[], isGallery: boolean): Observable<AttributeInfo[]> => {
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
