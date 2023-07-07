import { isNonEmptyArray } from '@apollo/client/utilities';
import { Observable, catchError, map, of } from 'rxjs';

import { ADULT_CONTENT_TAGS } from '../apis/objkt/adult-tags';
import { ADULT_ATTRIBUTE_NAME } from '../apis/objkt/constants';
import {
  fetchGalleryAttributeCount$,
  fetchFA2AttributeCount$,
  fetchAllCollectiblesDetails$
} from '../apis/objkt/index';
import { CollectibleAttributes } from '../apis/objkt/types';
import { AttributeInfo } from '../interfaces/attribute.interface';
import {
  CollectibleDetailsInterface,
  CollectibleInterface
} from '../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../token/utils/token.utils';

const attributesInfoInitialState: AttributeInfo[] = [
  {
    attribute_id: 0,
    tokens: 0
  }
];

export const getAttributesWithRarity = (
  attributesInfo: AttributeInfo[],
  collectibleDetails: CollectibleDetailsInterface
): CollectibleAttributes[] => {
  const isExistGallery = isNonEmptyArray(collectibleDetails.galleries);
  const collectibleCalleryCount = isExistGallery
    ? collectibleDetails.galleries[0].gallery.items
    : collectibleDetails.collection.items;

  return collectibleDetails.attributes.map(({ attribute }) => {
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

export const loadAllCollectiblesDetails$ = (
  publicKeyHash: string
): Observable<Record<string, CollectibleDetailsInterface>> =>
  fetchAllCollectiblesDetails$(publicKeyHash).pipe(
    map(collectiblesDetails => {
      const collectitblesDetailsRecord: Record<string, CollectibleDetailsInterface> = {};

      for (const collectible of collectiblesDetails) {
        const collectibleSlug = getTokenSlug({ address: collectible.fa_contract, id: collectible.token_id });

        const isAdultContent =
          collectible.attributes.some(({ attribute }) => attribute.name === ADULT_ATTRIBUTE_NAME) ||
          Boolean(collectible.tags.find(({ tag }) => ADULT_CONTENT_TAGS.includes(tag.name)));

        collectitblesDetailsRecord[collectibleSlug] = {
          ...collectible,
          editions: collectible.supply,
          collection: collectible.fa,
          listingsActive: collectible.listings_active.map(item => ({
            bigmapKey: item.bigmap_key,
            currencyId: item.currency_id,
            marketplaceContract: item.marketplace_contract,
            currency: item.currency,
            price: item.price
          })),
          isAdultContent
        };
      }

      return collectitblesDetailsRecord;
    })
  );

export const getCollectibleDetails = (collectible: CollectibleInterface): CollectibleDetailsInterface => ({
  description: collectible.description,
  editions: collectible.editions,
  isAdultContent: collectible.isAdultContent,
  creators: collectible.creators,
  collection: collectible.collection,
  metadata: collectible.metadata,
  attributes: collectible.attributes,
  tags: collectible.tags,
  timestamp: collectible.timestamp,
  royalties: collectible.royalties,
  mime: collectible.mime,
  galleries: collectible.galleries,
  listingsActive: collectible.listingsActive,
  artifactUri: collectible.artifactUri
});
