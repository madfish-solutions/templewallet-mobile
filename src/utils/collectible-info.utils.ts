import { isNonEmptyArray } from '@apollo/client/utilities';
import { Observable, catchError, map, of } from 'rxjs';

import { fetchGalleryAttributeCount$, fetchFA2AttributeCount$ } from '../apis/objkt/index';
import { AttributeInfo } from '../interfaces/attribute.interface';
import { CollectibleAttributes, CollectibleInfo } from '../interfaces/collectible-info.interface';

const attributesInfoInitialState: AttributeInfo[] = [
  {
    attribute_id: 0,
    tokens: 0
  }
];

export const getAttributesWithRarity = (
  attributesInfo: AttributeInfo[],
  collectibleInfo: CollectibleInfo
): CollectibleAttributes[] => {
  const isExistGallery = isNonEmptyArray(collectibleInfo.galleries);
  const collectibleCalleryCount = isExistGallery
    ? collectibleInfo.galleries[0].gallery.items
    : collectibleInfo.fa.items;

  return collectibleInfo.attributes.map(({ attribute }) => {
    const attributeTokenCount = attributesInfo.find(el => el.attribute_id === attribute.id)?.tokens ?? 0;
    const rarity = Number(((attributeTokenCount / collectibleCalleryCount) * 100).toFixed(2));

    return {
      attribute: {
        id: attribute.id,
        name: attribute.name,
        value: attribute.value,
        rarity
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
