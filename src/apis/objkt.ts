import { gql } from '@apollo/client';
import { catchError, map, Observable, of } from 'rxjs';

import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { isDefined } from 'src/utils/is-defined';

import { getApolloConfigurableClient } from '../apollo/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

interface QueryResponse {
  fa: { name: string; logo: string; creator_address: string; contract: string; tokens: { display_uri: string }[] }[];
}

interface TzProfilesQueryResponse {
  holder_by_pk: TzProfile;
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
  const request = buildTzProfilesQuery(address);

  return apolloObjktClient.query<TzProfilesQueryResponse>(request).pipe(
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

const buildTzProfilesQuery = (address: string) => gql`
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
