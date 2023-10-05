/**
 * Docs: https://public-api-v3-20221206.objkt.com/docs
 * Explore: https://public-api-v3-20221206.objkt.com/explore
 */

import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { chunk } from 'lodash-es';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleOfferInteface } from '../../token/interfaces/collectible-interfaces.interface';
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
  AttributeInfoResponse,
  CollectiblesByCollectionResponse,
  CollectiblesByGalleriesResponse,
  FA2AttributeCountQueryResponse,
  FxHashContractInterface,
  GalleryAttributeCountQueryResponse,
  ObjktCollectibleExtra,
  ObjktContractInterface,
  QueryResponse,
  TzProfilesQueryResponse,
  UserAdultCollectiblesQueryResponse
} from './types';
import { transformCollectiblesArray } from './utils';

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

export const fetchCollectiblesByCollection$ = (
  contract: string,
  selectedPublicKey: string,
  type: ObjktTypeEnum,
  offset: number,
  galleryId?: string
): Observable<CollectibleOfferInteface[]> => {
  const request =
    type === ObjktTypeEnum.faContract
      ? buildGetCollectiblesByCollectionQuery(contract, selectedPublicKey, offset)
      : buildGetCollectiblesByGalleryQuery(selectedPublicKey, offset);

  return apolloObjktClient.fetch$<CollectiblesByCollectionResponse | CollectiblesByGalleriesResponse>(request).pipe(
    map(result => {
      if ('token' in result) {
        const collectibles = transformCollectiblesArray(result.token);

        return collectibles;
      } else {
        const currentGallery = result.gallery.find(gallery => gallery.gallery_id === galleryId);
        const tokens =
          currentGallery?.tokens.map(token => {
            const items = token.gallery.items;

            return { ...token.token, fa: { items } };
          }) ?? [];
        const collectibles = transformCollectiblesArray(tokens);

        return collectibles;
      }
    })
  );
};

export const fetchAllCollectiblesDetails$ = (
  collectiblesSlugs: string[]
): Observable<UserAdultCollectiblesQueryResponse[]> => {
  const request = chunk(collectiblesSlugs, MAX_OBJKT_QUERY_RESPONSE_ITEMS).map(slugsChunk =>
    buildGetAllUserCollectiblesQuery(slugsChunk)
  );

  return forkJoin(request.map(r => apolloObjktClient.fetch$<UserAdultCollectiblesQueryResponse>(r)));
};

export const fetchFA2AttributeCount$ = (ids: number[]): Observable<AttributeInfoResponse[]> => {
  const request = buildGetFA2AttributeCountQuery(ids);

  return apolloObjktClient
    .fetch$<FA2AttributeCountQueryResponse>(request)
    .pipe(map(result => result.fa2_attribute_count));
};

export const fetchGalleryAttributeCount$ = (ids: number[]): Observable<AttributeInfoResponse[]> => {
  const request = buildGetGalleryAttributeCountQuery(ids);

  return apolloObjktClient
    .fetch$<GalleryAttributeCountQueryResponse>(request)
    .pipe(map(result => result.gallery_attribute_count));
};

export const fetchCollectibleExtraDetails = (contract: string, id: BigNumber.Value) =>
  apolloObjktClient
    .fetch<{ token: [ObjktCollectibleExtra] | [] }>(buildGetCollectibleExtraQuery(), {
      where: { fa_contract: { _eq: contract }, token_id: { _eq: String(id) } }
    })
    .then(data => data?.token[0] ?? null);

export const getObjktMarketplaceContract = (tezos: TezosToolkit, address?: string) =>
  tezos.contract.at<ObjktContractInterface | FxHashContractInterface>(address ?? OBJKT_CONTRACT);
