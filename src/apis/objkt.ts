import { gql } from '@apollo/client';
import { catchError, map, Observable, of } from 'rxjs';

import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { Collection } from 'src/store/collectons/collections-state';
import { isDefined } from 'src/utils/is-defined';

import { getApolloConfigurableClient } from '../apollo/utils/get-apollo-configurable-client.util';
import { CollectibleInfo } from '../interfaces/collectible-info.interface';

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
  const request = buildGetHoldersInfoQuery(address);

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

interface CollectibleInfoQueryResponse {
  token: CollectibleInfo[];
}

export const fetchCollectibleInfo$ = (address: string, tokenId: string) => {
  const request = buildGetCollectibleByAddressAndIdQuery(address, tokenId);

  return apolloObjktClient.query<CollectibleInfoQueryResponse>(request).pipe(
    map(result => {
      const { description, creators, fa, timestamp, artifact_uri, attributes, metadata, royalties, supply } =
        result.token[0];

      return {
        description,
        creators,
        fa: {
          name: fa.name,
          logo: fa.logo
        },
        metadata,
        artifact_uri,
        attributes,
        timestamp,
        royalties,
        supply
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

const buildGetCollectibleByAddressAndIdQuery = (address: string, tokenId: string) => gql`
  query MyQuery {
    token(where: { fa_contract: { _eq: "${address}" }, token_id: { _eq: "${tokenId}" } }) {
      description
      creators {
        holder {
          address
          tzdomain
        }
      }
      fa {
        name
        logo
      }
      metadata
      artifact_uri
      name
      attributes {
        attribute {
          name
          value
          id
        }
      }
      timestamp
      royalties {
        decimals
        amount
      }
      supply
    }
  }
`;
