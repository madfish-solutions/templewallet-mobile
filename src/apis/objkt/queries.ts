import { gql } from '@apollo/client';

export const buildGetCollectiblesInfoQuery = (address: string) => gql`
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

export const buildGetHoldersInfoQuery = (address: string) => gql`
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

export const buildGetCollectiblesByCollectionQuery = (contract: string) => gql`query MyQuery {
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
    holders {
        holder_address
      }
    offers_active {
        buyer_address
        collection_offer
        price_xtz
        bigmap_key
      }
  }
}`;
export const buildGetCollectibleByAddressAndIdQuery = (address: string, tokenId: string) => gql`
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
    }
  }
`;
