/**
 * Docs: https://public-api-v3-20221206.objkt.com/docs
 * Explore: https://public-api-v3-20221206.objkt.com/explore
 */

import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { chunk } from 'lodash-es';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { isDefined } from 'src/utils/is-defined';

import { apolloObjktClient, HIDDEN_CONTRACTS, OBJKT_CONTRACT } from './constants';
import {
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectiblesInfoQuery,
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
  FxHashContractInterface,
  GalleryAttributeCountQueryResponse,
  ObjktCollectibleExtra,
  ObjktContractInterface,
  QueryResponse,
  TzProfilesQueryResponse,
  UserAdultCollectiblesQueryResponse,
  ObjktCollectionType
} from './types';
import { transformObjktCollectionItem } from './utils';

export type { ObjktOffer } from './types';
export { objktCurrencies } from './constants';

const MAX_OBJKT_QUERY_RESPONSE_ITEMS = 500;

export const fetchCollectionsLogo$ = (address: string): Observable<Collection[]> => {
  const request = buildGetCollectiblesInfoQuery(address);

  return apolloObjktClient.fetch$<QueryResponse>(request).pipe(
    map(result => {
      const fa = result.fa
        .filter(item => !HIDDEN_CONTRACTS.includes(item.contract))
        .map(item => {
          const logo = item.logo !== null ? item.logo : item.tokens[0].display_uri;

          return { name: item.name, logo, contract: item.contract, creator: address, type: item.__typename };
        });
      const gallery = result.gallery.map(item => {
        return {
          name: item.name,
          logo: item.logo,
          contract: item.tokens[0].fa_contract,
          creator: address,
          type: item.__typename,
          galleryId: item.gallery_id
        };
      });

      return [...fa, ...gallery];
    }),
    catchError(() => of([]))
  );
};

export const fetchTzProfilesInfo$ = (address: string): Observable<TzProfile> => {
  const request = buildGetHoldersInfoQuery(address);

  return apolloObjktClient
    .fetch$<TzProfilesQueryResponse>(request, undefined, { nextFetchPolicy: 'no-cache' } as any) // TODO: Figure-out, what `nextFetchPolicy` was intended to do
    .pipe(
      map(result => {
        const { alias, discord, github, logo, twitter, tzdomain, website } = result.holder_by_pk;

        //check for nullable value
        return {
          alias: isDefined(alias) ? alias : undefined,
          discord: isDefined(discord) ? discord : undefined,
          github: isDefined(github) ? github : undefined,
          logo: isDefined(logo) ? logo : undefined,
          twitter: isDefined(twitter) ? twitter : undefined,
          tzdomain: isDefined(tzdomain) ? tzdomain : undefined,
          website: isDefined(website) ? website : undefined
        };
      })
    );
};

export const fetchCollectiblesOfCollection$ = (
  contract: string,
  creatorPkh: string,
  type: ObjktCollectionType,
  offset: number,
  galleryId?: string
) => {
  if (type === 'fa') {
    return apolloObjktClient
      .fetch$<CollectiblesByCollectionResponse>(buildGetCollectiblesByCollectionQuery(contract, creatorPkh, offset))
      .pipe(map(result => result.token.map(transformObjktCollectionItem)));
  }

  return apolloObjktClient
    .fetch$<CollectiblesByGalleriesResponse>(buildGetCollectiblesByGalleryQuery(creatorPkh, offset))
    .pipe(
      map(result => {
        const currentGallery = result.gallery.find(gallery => gallery.gallery_id === galleryId);

        return (
          currentGallery?.tokens.map(token => {
            const items = token.gallery.items;

            return transformObjktCollectionItem({ ...token.token, fa: { items } });
          }) ?? []
        );
      })
    );
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

export const getObjktMarketplaceContract = (tezos: TezosToolkit, address?: string) =>
  tezos.contract.at<ObjktContractInterface | FxHashContractInterface>(address ?? OBJKT_CONTRACT);
