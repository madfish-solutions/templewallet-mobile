/**
 * Docs: https://public-api-v3-20221206.objkt.com/docs
 * Explore: https://public-api-v3-20221206.objkt.com/explore
 */

import BigNumber from 'bignumber.js';
import { chunk } from 'lodash-es';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { Collection } from 'src/store/collectons/collections-state';
import { isDefined } from 'src/utils/is-defined';

import { apolloObjktClient, HIDDEN_CONTRACTS } from './constants';
import {
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectionsQuery,
  buildGetFA2AttributeCountQuery,
  buildGetGalleryAttributeCountQuery,
  buildGetHoldersInfoQuery,
  buildGetAllUserCollectiblesQuery,
  buildGetCollectiblesByGalleryQuery,
  buildGetCollectibleExtraQuery
} from './queries';
import {
  ObjktCollectibleDetails,
  CollectiblesByCollectionResponse,
  CollectiblesByGalleriesResponse,
  FA2AttributeCountQueryResponse,
  GalleryAttributeCountQueryResponse,
  ObjktCollectibleExtra,
  QueryResponse,
  TzProfilesQueryResponse,
  UserAdultCollectiblesQueryResponse
} from './types';
import { transformObjktCollectionItem } from './utils';

export { objktCurrencies } from './constants';

const MAX_OBJKT_QUERY_RESPONSE_ITEMS = 500;

export const fetchCollections$ = (accountPkh: string): Observable<Collection[]> => {
  const request = buildGetCollectionsQuery(accountPkh);

  return apolloObjktClient.fetch$<QueryResponse>(request).pipe(
    map(result => {
      const fa = result.fa
        .filter(item => !HIDDEN_CONTRACTS.includes(item.contract))
        .map<Collection>(item => {
          const logo = item.logo !== null ? item.logo : item.tokens[0].display_uri;

          return { name: item.name, logo, contract: item.contract, creator: accountPkh, type: item.__typename };
        });

      const gallery = result.gallery.map<Collection>(item => ({
        name: item.name,
        logo: item.logo,
        contract: item.tokens[0]!.fa_contract,
        creator: accountPkh,
        type: item.__typename,
        galleryPk: item.pk
      }));

      return [...fa, ...gallery];
    }),
    catchError(() => of([]))
  );
};

export const fetchTzProfilesInfo = (address: string) =>
  apolloObjktClient
    .fetch<TzProfilesQueryResponse>(buildGetHoldersInfoQuery(address), undefined, {
      // @ts-ignore // TODO: Figure-out, what `nextFetchPolicy` was intended to do
      nextFetchPolicy: 'no-cache'
    })
    .then(data => {
      if (!data) {
        throw new Error('No data');
      }

      return data.holder_by_pk;
    });

export const fetchCollectiblesOfCollection$ = (
  contract: string,
  creatorPkh: string,
  offset: number,
  galleryPk?: number
) => {
  if (isDefined(galleryPk)) {
    return apolloObjktClient
      .fetch$<CollectiblesByGalleriesResponse>(buildGetCollectiblesByGalleryQuery(galleryPk, offset))
      .pipe(
        map(result => {
          const gallery = result.gallery[0];

          return gallery?.tokens.map(token => transformObjktCollectionItem(token.token, token.gallery.max_items)) ?? [];
        })
      );
  }

  return apolloObjktClient
    .fetch$<CollectiblesByCollectionResponse>(buildGetCollectiblesByCollectionQuery(contract, creatorPkh, offset))
    .pipe(map(result => result.token.map(token => transformObjktCollectionItem(token, token.fa.items))));
};

export const fetchObjktCollectiblesBySlugs$ = (slugs: string[]) =>
  forkJoin(
    chunk(slugs, MAX_OBJKT_QUERY_RESPONSE_ITEMS).map(slugsChunk => fetchObjktCollectiblesBySlugsChunk$(slugsChunk))
  ).pipe(map(res => res.reduce<ObjktCollectibleDetails[]>((acc, curr) => acc.concat(curr.token), [])));

const fetchObjktCollectiblesBySlugsChunk$ = (slugs: string[]) =>
  apolloObjktClient.fetch$<UserAdultCollectiblesQueryResponse>(buildGetAllUserCollectiblesQuery(slugs));

export const fetchAttributesCounts = (ids: number[], isGallery: boolean) =>
  isGallery
    ? apolloObjktClient
        .fetch<GalleryAttributeCountQueryResponse>(buildGetGalleryAttributeCountQuery(ids))
        .then(data => data?.gallery_attribute_count)
    : apolloObjktClient
        .fetch<FA2AttributeCountQueryResponse>(buildGetFA2AttributeCountQuery(ids))
        .then(data => data?.fa2_attribute_count);

export const fetchCollectibleExtraDetails = (contract: string, id: BigNumber.Value) =>
  apolloObjktClient
    .fetch<{ token: [ObjktCollectibleExtra] | [] }>(buildGetCollectibleExtraQuery(), {
      where: { fa_contract: { _eq: contract }, token_id: { _eq: String(id) } }
    })
    .then(data => data?.token[0] ?? null);
