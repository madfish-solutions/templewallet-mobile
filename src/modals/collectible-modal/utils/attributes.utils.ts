import { HIDDEN_ATTRIBUTES_NAME } from 'src/apis/objkt/constants';
import { AttributeInfoResponse } from 'src/apis/objkt/types';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { CollectibleAttribute } from '../types';

export const getAttributesWithRarity = (
  attributesInfo: AttributeInfoResponse[],
  collectible: CollectibleDetailsInterface
): CollectibleAttribute[] => {
  const isExistGallery = collectible.galleries.length > 0;
  const collectibleGalleryCount = isExistGallery
    ? collectible.galleries?.[0].gallery?.editions
    : collectible.collection.editions;

  const galleryPk = isExistGallery ? collectible.galleries?.[0].gallery?.pk : 0;

  return collectible.attributes
    .filter(({ attribute }) => !HIDDEN_ATTRIBUTES_NAME.includes(attribute.name))
    .map(({ attribute }) => {
      const attributeTokenCount = attributesInfo.reduce((acc, current) => {
        if (current.attribute_id !== attribute.id) {
          return acc;
        }
        if (isExistGallery) {
          return current.gallery_pk === galleryPk ? acc + current.editions : acc;
        } else {
          return current.fa_contract === collectible.address ? acc + current.editions : acc;
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
