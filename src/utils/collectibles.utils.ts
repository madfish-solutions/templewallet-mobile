import { Observable, catchError, map, of } from 'rxjs';

import { HIDDEN_ATTRIBUTES_NAME } from 'src/apis/objkt/constants';
import { fetchGalleryAttributeCount$, fetchFA2AttributeCount$ } from 'src/apis/objkt/index';
import { ObjktAttribute } from 'src/apis/objkt/types';
import { AttributeInfo } from 'src/interfaces/attribute.interface';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

const attributesInfoInitialState: AttributeInfo[] = [
  {
    attributeId: 0,
    editions: 0,
    faContract: ''
  }
];

export const getAttributesWithRarity = (
  attributesInfo: AttributeInfo[],
  collectible: CollectibleDetailsInterface
): ObjktAttribute[] => {
  const isExistGallery = collectible.galleries.length > 0;
  const collectibleGalleryCount = isExistGallery
    ? collectible.galleries?.[0].gallery?.editions
    : collectible.collection.editions;

  const galleryPk = isExistGallery ? collectible.galleries?.[0].gallery?.pk : 0;

  return collectible.attributes
    .filter(({ attribute }) => !HIDDEN_ATTRIBUTES_NAME.includes(attribute.name))
    .map(({ attribute }) => {
      const attributeTokenCount = attributesInfo.reduce((acc, current) => {
        if (current.attributeId !== attribute.id) {
          return acc;
        }
        if (isExistGallery) {
          return current.galleryPk === galleryPk ? acc + current.editions : acc;
        } else {
          return current.faContract === collectible.address ? acc + current.editions : acc;
        }
      }, 0);

      const rarity = Number(((attributeTokenCount / collectibleGalleryCount) * 100).toFixed(2));

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
      map(result =>
        result.map(({ attribute_id, editions, gallery_pk }) => ({
          attributeId: attribute_id,
          editions,
          galleryPk: gallery_pk
        }))
      ),
      catchError(() => of(attributesInfoInitialState))
    );
  }

  return fetchFA2AttributeCount$(ids).pipe(
    map(result =>
      result.map(({ attribute_id, editions, fa_contract }) => ({
        attributeId: attribute_id,
        editions,
        faContract: fa_contract
      }))
    ),
    catchError(() => of(attributesInfoInitialState))
  );
};
