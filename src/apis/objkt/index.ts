import { catchError, map, Observable, of } from 'rxjs';

import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo, UserAdultCollectibles } from '../../interfaces/collectible-info.interface';
import { apolloObjktClient, HIDDEN_CONTRACTS } from './constants';
import {
  buildGetCollectibleByAddressAndIdQuery,
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectiblesInfoQuery,
  buildGetFA2AttributeCountQuery,
  buildGetGalleryAttributeCountQuery,
  buildGetHoldersInfoQuery,
  buildGetUserAdultCollectiblesQuery,
  buildGetCollectiblesByGalleryQuery
} from './queries';
import {
  CollectibleInfoQueryResponse,
  CollectiblesByCollectionResponse,
  CollectiblesByGalleriesResponse,
  FA2AttributeCountQueryResponse,
  GalleryAttributeCountQueryResponse,
  QueryResponse,
  TzProfilesQueryResponse,
  UserAdultCollectiblesQueryResponse
} from './types';
import { getUniqueAndMaxValueAttribute, transformCollectiblesArray } from './utils';

export const fetchCollectionsLogo$ = (address: string): Observable<Collection[]> => {
  const request = buildGetCollectiblesInfoQuery(address);

  return apolloObjktClient.query<QueryResponse>(request).pipe(
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

  return apolloObjktClient.query<TzProfilesQueryResponse>(request, undefined, { nextFetchPolicy: 'no-cache' }).pipe(
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
): Observable<TokenInterface[]> => {
  const request =
    type === ObjktTypeEnum.faContract
      ? buildGetCollectiblesByCollectionQuery(contract, selectedPublicKey, offset)
      : buildGetCollectiblesByGalleryQuery(selectedPublicKey, offset);

  return apolloObjktClient.query<CollectiblesByCollectionResponse | CollectiblesByGalleriesResponse>(request).pipe(
    map(result => {
      if ('token' in result) {
        const collectibles = transformCollectiblesArray(result.token, selectedPublicKey);

        return collectibles;
      } else {
        const currentGallery = result.gallery.find(gallery => gallery.gallery_id === galleryId);
        const tokens =
          currentGallery?.tokens.map(token => {
            const items = token.gallery.items;

            return { ...token.token, fa: { items } };
          }) ?? [];
        const collectibles = transformCollectiblesArray(tokens, selectedPublicKey);

        return collectibles;
      }
    })
  );
};

export const fetchCollectibleInfo$ = (address: string, tokenId: string): Observable<CollectibleInfo> => {
  const request = buildGetCollectibleByAddressAndIdQuery(address, tokenId);

  return apolloObjktClient.query<CollectibleInfoQueryResponse>(request).pipe(
    map(result => {
      const {
        description,
        creators,
        fa,
        timestamp,
        artifact_uri,
        attributes,
        metadata,
        royalties,
        supply,
        listings_active,
        mime,
        galleries
      } = result.token[0];

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
        galleries,
        listings_active,
        mime
      };
    })
  );
};

export const fetchUserAdultCollectibles$ = (address: string): Observable<UserAdultCollectibles[]> => {
  const request = buildGetUserAdultCollectiblesQuery(address);

  return apolloObjktClient.query<UserAdultCollectiblesQueryResponse>(request).pipe(map(result => result.token));
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
