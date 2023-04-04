import { gql } from '@apollo/client';
import { catchError, map, Observable, of } from 'rxjs';

import { Collection } from 'src/store/collectons/collections-state';

import { getApolloConfigurableClient } from '../apollo/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

interface ObjktQueryResult {
  fa_by_pk: Collection;
}

export const fetchCollectionsLogo$ = (contract: string): Observable<Collection> => {
  const request = buildGetCollectiblesLogoQuery(contract);

  return apolloObjktClient.query<ObjktQueryResult>(request).pipe(
    map(data => {
      const { logo, name, contract } = data.fa_by_pk;

      return { logo, name, contract };
    }),
    catchError(() => of({ logo: '', name: 'Unknown collection', contract: '' }))
  );
};

const buildGetCollectiblesLogoQuery = (contract: string) => gql`
  query MyQuery {
    fa_by_pk(contract: "${contract}") {
      logo
      name
      contract
    }
  }
`;
