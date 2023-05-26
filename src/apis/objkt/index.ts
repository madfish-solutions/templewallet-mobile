import { catchError, map, Observable, of } from 'rxjs';

import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { apolloObjktClient, HIDDEN_CONTRACTS } from './constants';
import {
  buildGetCollectibleByAddressAndIdQuery,
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectiblesInfoQuery,
  buildGetHoldersInfoQuery,
  getCollectiblesByGalleryQuery
} from './queries';
import {
  CollectibleInfoQueryResponse,
  CollectiblesByCollectionResponse,
  CollectiblesByGalleriesResponse,
  QueryResponse,
  TzProfilesQueryResponse
} from './types';
import { transformCollectiblesArray } from './utils';

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
          type: item.__typename
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
  type: ObjktTypeEnum
): Observable<TokenInterface[]> => {
  const request =
    type === ObjktTypeEnum.faContract
      ? buildGetCollectiblesByCollectionQuery(contract)
      : getCollectiblesByGalleryQuery(selectedPublicKey);

  return apolloObjktClient.query<CollectiblesByCollectionResponse | CollectiblesByGalleriesResponse>(request).pipe(
    map(result => {
      if ('token' in result) {
        const collectibles = transformCollectiblesArray(result.token, selectedPublicKey);

        return collectibles;
      } else {
        const tokens = result.gallery[0].tokens.map(token => token.token).flat();
        const collectibles = transformCollectiblesArray(tokens, selectedPublicKey);

        return collectibles;
      }
    })
  );
};

export const fetchCollectibleInfo$ = (address: string, tokenId: string) => {
  const request = buildGetCollectibleByAddressAndIdQuery(address, tokenId);

  return apolloObjktClient.query<CollectibleInfoQueryResponse>(request).pipe(
    map(result => {
      const { description, creators, fa } = result.token[0];

      return {
        description,
        creators,
        collection: {
          name: fa.name,
          logo: fa.logo
        }
      };
    })
  );
};
