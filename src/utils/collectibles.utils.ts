import { isNonEmptyArray } from '@apollo/client/utilities';
import { pick } from 'lodash-es';
import { Observable, catchError, map, of } from 'rxjs';

import { ADULT_CONTENT_TAGS } from 'src/apis/objkt/adult-tags';
import { ADULT_ATTRIBUTE_NAME, HIDDEN_ATTRIBUTES_NAME } from 'src/apis/objkt/constants';
import {
  fetchGalleryAttributeCount$,
  fetchFA2AttributeCount$,
  fetchAllCollectiblesDetails$
} from 'src/apis/objkt/index';
import { CollectibleAttributes, CollectibleDetailsResponse, CollectibleTag } from 'src/apis/objkt/types';
import { AttributeInfo } from 'src/interfaces/attribute.interface';
import {
  CollectibleDetailsInterface,
  CollectibleInterface
} from 'src/token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

const attributesInfoInitialState: AttributeInfo[] = [
  {
    attributeId: 0,
    tokens: 0,
    editions: 0,
    faContract: ''
  }
];

export const getAttributesWithRarity = (
  attributesInfo: AttributeInfo[],
  collectible: CollectibleInterface
): CollectibleAttributes[] => {
  const isExistGallery = isNonEmptyArray(collectible.galleries);
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
        result.map(({ attribute_id, tokens, editions, gallery_pk }) => ({
          attributeId: attribute_id,
          tokens,
          editions,
          galleryPk: gallery_pk
        }))
      ),
      catchError(() => of(attributesInfoInitialState))
    );
  }

  return fetchFA2AttributeCount$(ids).pipe(
    map(result =>
      result.map(({ attribute_id, tokens, editions, fa_contract }) => ({
        attributeId: attribute_id,
        tokens,
        editions,
        faContract: fa_contract
      }))
    ),
    catchError(() => of(attributesInfoInitialState))
  );
};

export const isAdultCollectible = (attributes?: CollectibleAttributes[], tags?: CollectibleTag[]) => {
  let includesAdultAttributes = false;
  let includesAdultTags = false;

  if (isNonEmptyArray(attributes)) {
    includesAdultAttributes = attributes.some(({ attribute }) => attribute.name === ADULT_ATTRIBUTE_NAME);
  }

  if (isNonEmptyArray(tags)) {
    includesAdultTags = tags.some(({ tag }) => ADULT_CONTENT_TAGS.includes(tag.name));
  }

  return includesAdultAttributes || includesAdultTags;
};

export const loadAllCollectiblesDetails$ = (
  collectiblesSlugs: string[]
): Observable<Record<string, CollectibleDetailsInterface>> =>
  fetchAllCollectiblesDetails$(collectiblesSlugs).pipe(
    map(collectiblesDetailsArray => {
      const collectiblesDetails = collectiblesDetailsArray.reduce<CollectibleDetailsResponse[]>(
        (acc, current) => acc.concat(current.token),
        []
      );

      const collectitblesDetailsRecord: Record<string, CollectibleDetailsInterface> = {};

      for (const collectible of collectiblesDetails) {
        const collectibleSlug = getTokenSlug({ address: collectible.fa_contract, id: collectible.token_id });

        collectitblesDetailsRecord[collectibleSlug] = {
          ...pick(
            collectible,
            'name',
            'description',
            'creators',
            'metadata',
            'attributes',
            'tags',
            'timestamp',
            'royalties',
            'mime',
            'galleries'
          ),
          address: collectible.fa_contract,
          id: +collectible.token_id,
          artifactUri: collectible.artifact_uri,
          thumbnailUri: collectible.thumbnail_uri,
          displayUri: collectible.display_uri,
          editions: collectible.supply,
          collection: collectible.fa,
          listingsActive: isNonEmptyArray(collectible.listings_active)
            ? [
                {
                  bigmapKey: collectible.listings_active[0].bigmap_key,
                  currencyId: collectible.listings_active[0].currency_id,
                  marketplaceContract: collectible.listings_active[0].marketplace_contract,
                  currency: collectible.listings_active[0].currency,
                  price: collectible.listings_active[0].price
                }
              ]
            : []
        };
      }

      return collectitblesDetailsRecord;
    })
  );
