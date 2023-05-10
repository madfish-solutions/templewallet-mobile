import { catchError, map, Observable, of } from 'rxjs';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { getApolloConfigurableClient } from '../../apollo/utils/get-apollo-configurable-client.util';
import { MarketPlaceEventEnum } from './enums';
import {
  CollectibleInfoQueryResponse,
  CollectiblesByCollectionResponse,
  QueryResponse,
  TzProfilesQueryResponse
} from './interfaces';
import {
  buildGetCollectibleByAddressAndIdQuery,
  buildGetCollectiblesByCollectionQuery,
  buildGetCollectiblesInfoQuery,
  buildGetHoldersInfoQuery
} from './queries';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

export const fetchCollectionsLogo$ = (address: string): Observable<Collection[]> => {
  const request = buildGetCollectiblesInfoQuery(address);

  return apolloObjktClient.query<QueryResponse>(request).pipe(
    map(result =>
      result.fa.map(item => {
        const logo = item.logo !== null ? item.logo : item.tokens[0].display_uri;

        return { name: item.name, logo, contract: item.contract, creator: item.creator_address };
      })
    ),
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

export const fetchCollectiblesByCollection$ = (contract: string): Observable<TokenInterface[]> => {
  const request = buildGetCollectiblesByCollectionQuery(contract);

  return apolloObjktClient.query<CollectiblesByCollectionResponse>(request).pipe(
    map(result => {
      const collectiblesArray = result.token
        .map(token => {
          const buyEvents = token.events.filter(
            ({ marketplace_event_type }) =>
              marketplace_event_type === MarketPlaceEventEnum.dutchAuctionBuy ||
              marketplace_event_type === MarketPlaceEventEnum.listBuy ||
              marketplace_event_type === MarketPlaceEventEnum.offerAccept ||
              marketplace_event_type === MarketPlaceEventEnum.offerFloorAccept
          );
          const lastPrice = buyEvents?.[buyEvents.length - 1]?.price_xtz;

          return {
            artifactUri: token.artifact_uri,
            balance: '1',
            decimals: token.decimals,
            description: token.description,
            displayUri: token.display_uri,
            address: token.fa_contract,
            highestOffer: token.highest_offer,
            name: token.name,
            metadata: token.metadata,
            lowestAsk: token.lowest_ask,
            symbol: token.symbol,
            thumbnailUri: token.thumbnail_uri,
            id: Number(token.token_id),
            visibility: VisibilityEnum.Visible,
            editions: token.supply,
            lastPrice
          };
        })
        .filter(collectible => collectible.editions !== 0);

      return collectiblesArray;
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
