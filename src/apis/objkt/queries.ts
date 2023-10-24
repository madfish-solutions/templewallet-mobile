import { gql } from '@apollo/client';

import { fromTokenSlug } from 'src/utils/from-token-slug';

import { PAGINATION_STEP_FA, PAGINATION_STEP_GALLERY } from './constants';

export const buildGetCollectionsQuery = (creatorPkh: string) => gql`
  query MyQuery {
    fa(
      where: {
        _or: [
          { creator_address: { _eq: "${creatorPkh}" } }
          {
            tokens: {
              creators: { creator_address: { _eq: "${creatorPkh}" }, verified: { _eq: true } }
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
      where: { curators: { curator_address: { _eq: "${creatorPkh}" } }, max_items: { _gt: 0 } }
      order_by: { inserted_at: asc }
    ) {
      __typename
      pk
      name
      logo
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
    events(order_by: {timestamp: desc}) {
      event_type
      marketplace_event_type
      price_xtz
      price
      currency_id
      timestamp
    }
    listings_active(order_by: {price_xtz: asc}) {
      amount_left
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

export const buildGetCollectiblesByGalleryQuery = (galleryPk: number, offset: number) => gql`
query MyQuery {
  gallery(
    where: { pk: { _eq: "${galleryPk}"} }
  ) {
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
        events(order_by: {timestamp: desc}) {
          event_type
          marketplace_event_type
          price_xtz
          price
          currency_id
          timestamp
        }
        listings_active(order_by: {price_xtz: asc}) {
          amount_left
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
        max_items
      }
    }
  }
}
`;

export const buildGetFA2AttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    fa2_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      editions
      fa_contract
    }
  }
`;

export const buildGetGalleryAttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    gallery_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      editions
      gallery_pk
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
          editions
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
            name
            editions
            pk
          }
        }
        lowest_ask
        listings_active(order_by: {price_xtz: asc}) {
          amount_left
          seller_address
          bigmap_key
          currency_id
          marketplace_contract
          price
          currency {
            type
          }
        }
      }
    }
  `;
};

export const buildGetCollectibleExtraQuery = () => gql`
  query CollectiblesExtraQuery($where: token_bool_exp) {
    token(where: $where) {
      offers_active(order_by: { price_xtz: desc }) {
        buyer_address
        price
        currency_id
        bigmap_key
        marketplace_contract
        fa_contract
      }
    }
  }
`;
