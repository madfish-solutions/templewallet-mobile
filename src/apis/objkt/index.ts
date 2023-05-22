import { Observable, map } from 'rxjs';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo } from '../../interfaces/collectible-info.interface';
import { apolloObjktClient } from './constants';
import {
  CollectibleInfoQueryResponse,
  FA2AttributeCountQueryResponse,
  GalleryAttributeCountQueryResponse
} from './interfaces';
import {
  buildGetCollectibleByAddressAndIdQuery,
  buildGetFA2AttributeCountQuery,
  buildGetGalleryAttributeCountQuery
} from './queries';
import { getUniqueAndMaxValueAttribute } from './utils';

export const fetchCollectibleInfo$ = (address: string, tokenId: string): Observable<CollectibleInfo> => {
  const request = buildGetCollectibleByAddressAndIdQuery(address, tokenId);

  return apolloObjktClient.query<CollectibleInfoQueryResponse>(request).pipe(
    map(result => {
      const { description, creators, fa, timestamp, artifact_uri, attributes, metadata, royalties, supply, galleries } =
        result.token[0];

      return {
        description,
        creators,
        fa: {
          name: fa.name,
          logo: fa.logo,
          items: fa.items
        },
        metadata,
        artifact_uri,
        attributes,
        timestamp,
        royalties,
        supply,
        galleries
      };
    })
  );
};

export const fetchFA2AttributeCount$ = (ids: number[]): Observable<AttributeInfo[]> => {
  const request = buildGetFA2AttributeCountQuery(ids);

  return apolloObjktClient
    .query<FA2AttributeCountQueryResponse>(request)
    .pipe(map(result => getUniqueAndMaxValueAttribute(result.fa2_attribute_count)));
};

export const fetchGalleryAttributeCount$ = (ids: number[]): Observable<AttributeInfo[]> => {
  const request = buildGetGalleryAttributeCountQuery(ids);

  return apolloObjktClient
    .query<GalleryAttributeCountQueryResponse>(request)
    .pipe(map(result => getUniqueAndMaxValueAttribute(result.gallery_attribute_count)));
};
