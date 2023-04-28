import { gql } from '@apollo/client';
import { catchError, map, Observable, of } from 'rxjs';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { getApolloConfigurableClient } from '../apollo/utils/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

interface CollectibleResponse {
  artifact_uri: string;
  description: string;
  decimals: number;
  display_uri: string;
  fa_contract: string;
  highest_offer: number;
  last_listed: string;
  last_metadata_update: string;
  lowest_ask: number;
  metadata: string;
  name: string;
  thumbnail_uri: string;
  supply: number;
  symbol: string;
  token_id: string;
}

interface QueryResponse {
  fa: { name: string; logo: string; creator_address: string; contract: string; tokens: { display_uri: string }[] }[];
}

interface TzProfilesQueryResponse {
  holder_by_pk: TzProfile;
}

interface CollectiblesByCollectionResponse {
  token: CollectibleResponse[];
}

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
  const request = buildGetCollectioblesByCollectionQuery(contract);

  return apolloObjktClient.query<CollectiblesByCollectionResponse>(request).pipe(
    map(result => {
      const collectiblesArray = result.token.map(token => {
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
          editions: token.supply
        };
      });

      return collectiblesArray;
    })
  );
};

const buildGetCollectiblesInfoQuery = (address: string) => gql`
  query MyQuery {
    fa(where: { creator_address: { _eq: "${address}" } }) {
      creator_address
      logo
      name
      contract
      tokens {
        display_uri
      }
    }
  }
`;

const buildGetHoldersInfoQuery = (address: string) => gql`
  query MyQuery {
    holder_by_pk(address: "${address}") {
      alias
      discord
      github
      logo
      twitter
      tzdomain
      website
    }
  }
`;

const buildGetCollectioblesByCollectionQuery = (contract: string) => gql`query MyQuery {
  token(where: {fa_contract: {_eq: "${contract}"}}) {
    artifact_uri
    description
    display_uri
    decimals
    fa_contract
    highest_offer
    is_boolean_amount
    last_listed
    last_metadata_update
    lowest_ask
    metadata
    name
    thumbnail_uri  
    token_id
    supply
    symbol
  }
}`;
