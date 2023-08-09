import { isNonEmptyArray } from '@apollo/client/utilities';
import { Observable, catchError, map, of } from 'rxjs';

import { ADULT_CONTENT_TAGS } from '../apis/objkt/adult-tags';
import { ADULT_ATTRIBUTE_NAME } from '../apis/objkt/constants';
import {
  fetchGalleryAttributeCount$,
  fetchFA2AttributeCount$,
  fetchAllCollectiblesDetails$
} from '../apis/objkt/index';
import { CollectibleAttributes, CollectibleTag } from '../apis/objkt/types';
import { AttributeInfo } from '../interfaces/attribute.interface';
import {
  CollectibleDetailsInterface,
  CollectibleInterface
} from '../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../token/utils/token.utils';

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
    ? collectible.galleries[0].gallery.editions
    : collectible.collection.editions;

  const galleryPk = collectible.galleries[0].gallery.pk;

  return collectible.attributes.map(({ attribute }) => {
    const attributeTokenCount = attributesInfo.reduce((acc, current) => {
      if (!isExistGallery && current.faContract === collectible.address && current.attributeId === attribute.id) {
        acc = acc + current.editions;
      }
      if (isExistGallery && current.attributeId === attribute.id && current.galleryPk === galleryPk) {
        acc = acc + current.editions;
      }

      return acc;
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
    map(collectiblesDetails => {
      const collectitblesDetailsRecord: Record<string, CollectibleDetailsInterface> = {};

      for (const collectible of collectiblesDetails.token) {
        const collectibleSlug = getTokenSlug({ address: collectible.fa_contract, id: collectible.token_id });

        collectitblesDetailsRecord[collectibleSlug] = {
          address: collectible.fa_contract,
          id: +collectible.token_id,
          name: collectible.name,
          description: collectible.description,
          creators: collectible.creators,
          metadata: collectible.metadata,
          attributes: collectible.attributes,
          tags: collectible.tags,
          timestamp: collectible.timestamp,
          royalties: collectible.royalties,
          mime: collectible.mime,
          galleries: collectible.galleries,
          artifactUri: collectible.artifact_uri,
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
