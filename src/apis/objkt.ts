import { gql } from '@apollo/client';
import { catchError, map, Observable, of } from 'rxjs';

import { Collection } from 'src/store/collectons/collections-state';

import { getApolloConfigurableClient } from '../apollo/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

interface QueryResponse {
  fa: { name: string; logo: string; creator_address: string; contract: string; tokens: { display_uri: string }[] }[];
}

export const fetchCollectionsLogo$ = (address: string): Observable<Collection[]> => {
  const request = buildGetCollectiblesLogoQuery(address);

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

const buildGetCollectiblesLogoQuery = (address: string) => gql`
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
