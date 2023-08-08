import { gql } from '@apollo/client';

import { fromTokenSlug } from '../../utils/from-token-slug';
import { PAGINATION_STEP_FA, PAGINATION_STEP_GALLERY } from './constants';

export const buildGetCollectiblesInfoQuery = (address: string) => gql`
  query MyQuery {
    fa(
      where: {
        _or: [
          { creator_address: { _eq: "${address}" } }
          {
            tokens: {
              creators: { creator_address: { _eq: "${address}" }, verified: { _eq: true } }
            }
          }
        ]
      }
    ) {
      creator_address
      logo
      name
      contract
    }
    gallery(
      where: { curators: { curator_address: { _eq: "${address}" } }, max_items: { _gt: 0 } }
      order_by: { inserted_at: asc }
    ) {
      __typename
      name
      logo
      gallery_id
      tokens(limit: 1) {
        fa_contract
        __typename
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

export const buildGetCollectiblesByCollectionQuery = (
  contract: string,
  address: string,
  offset: number
) => gql`query MyQuery {
  token(
    where: {fa_contract: {_eq: "${contract}"}, supply: {_gt: "0"}, creators: {creator_address: {_eq: "${address}"}}}
    limit: ${PAGINATION_STEP_FA}
    offset: ${offset}
    order_by: {token_id: asc}) {
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
    mime
    holders {
        holder_address
        quantity
      }
    offers_active(distinct_on: price_xtz) {
        buyer_address
        collection_offer
        price_xtz
        price
        bigmap_key
        marketplace_contract
        fa_contract
        currency_id
      }
    events(order_by: {timestamp: desc}) {
      event_type
      marketplace_event_type
      price_xtz
      price
      currency_id
      timestamp
    }
    listings_active(order_by: {price_xtz: asc}) {
      amount
      seller_address
      bigmap_key
      currency_id
      marketplace_contract
      price
      currency {
        type
      }
    }
    fa {
      items
    }
  }
}`;

export const buildGetCollectiblesByGalleryQuery = (address: string, offset: number) => gql`
query MyQuery {
  gallery(
    where: {curators: {curator_address: {_eq: "${address}"}}, max_items: {_gt: 0}}
    order_by: {inserted_at: asc}
  ) {
    gallery_id
    tokens(
      limit: ${PAGINATION_STEP_GALLERY}
      offset: ${offset}
    ) {
      token {
        artifact_uri
        display_uri
        decimals
        description
        fa_contract
        highest_offer
        is_boolean_amount
        last_listed
        last_metadata_update
        lowest_ask
        metadata
        mime
        name
        thumbnail_uri
        token_id
        supply
        symbol
        holders {
          holder_address
          quantity
        }
        offers_active(distinct_on: price_xtz) {
          buyer_address
          collection_offer
          price_xtz
          price
          bigmap_key
          marketplace_contract
          fa_contract
          currency_id
        }
        events(order_by: {timestamp: desc}) {
          event_type
          marketplace_event_type
          price_xtz
          price
          currency_id
          timestamp
        }
        listings_active(order_by: {price_xtz: asc}) {
          amount
          seller_address
          bigmap_key
          currency_id
          marketplace_contract
          price
          currency {
            type
          }
        }
        fa {
          items
        }
      }
      gallery {
        items
      }
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

export const buildGetAllUserCollectiblesQuery = (collectiblesSlugs: string[]) => {
  const items = collectiblesSlugs.map(slug => fromTokenSlug(slug));

  return gql`
    query MyQuery {
      token(where: {
        _or: [
          ${items
            .map(([contract, id]) => `{ fa_contract: {_eq: "${contract}"}, token_id: {_eq: "${id}"} }`)
            .join(',\n')}
        ]
      }) {
        fa_contract
        token_id
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
        thumbnail_uri
        display_uri
        mime
        name
        tags {
          tag {
            name
          }
        }
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
        listings_active(order_by: {price_xtz: asc}) {
          bigmap_key
          currency_id
          price
          marketplace_contract
          id
          currency {
            type
          }
        }
      }
    }
  `;
};

export const buildGetCollectibleByAddressAndIdQuery = (address: string, tokenId: string) => gql`
  query MyQuery {
    token(where: { fa_contract: { _eq: "${address}" }, token_id: { _eq: "${tokenId}" } }) {
      fa_contract
      token_id
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
      mime
      galleries {
        gallery {
          items
          name
        }
      }
      lowest_ask
      listings_active(order_by: {price_xtz: asc}) {
        bigmap_key
        currency_id
        price
        marketplace_contract
        currency {
          type
        }
      }
    }
  }
`;
