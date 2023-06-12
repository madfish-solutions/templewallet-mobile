import { gql } from '@apollo/client';

import { ADULT_CONTENT_TAGS } from './adult-tags';
import { ADULT_ATTRIBUTE_NAME } from './constants';

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
        items
      }
      metadata
      artifact_uri
      name
      attributes {
        attribute {
          id
          name
          value
        }
      }
      timestamp
      royalties {
        decimals
        amount
      }
      supply
      galleries {
        gallery {
          items
          name
        }
      }
      lowest_ask
      listings_active {
        bigmap_key
        currency_id
        price
        marketplace_contract
      }
    }
  }
`;

export const buildGetFA2AttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    fa2_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      tokens
    }
  }
`;

export const buildGetGalleryAttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    gallery_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      tokens
    }
  }
`;

export const buildGetUserAdultCollectiblesQuery = (address: string) => {
  return gql`
    query MyQuery {
      token(
        where: {
          holders: { holder_address: { _eq: "${address}" } }
          _or: [
            { attributes: { attribute: { name: { _eq: "${ADULT_ATTRIBUTE_NAME}" } } } }
            { tags: { tag: { name: { _in: [${ADULT_CONTENT_TAGS}] } } } }
          ]
        }
      ) {
        fa_contract
        token_id
      }
    }
  `;
};
