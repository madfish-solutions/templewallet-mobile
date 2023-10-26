import { gql } from '@apollo/client';

import { FA_COLLECTION_PAGINATION_STEP, GALLERY_COLLECTION_PAGINATION_STEP } from './constants';

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

export const buildGetCollectiblesByCollectionQuery = (contract: string, address: string, offset: number) => gql`
  query MyQuery {
    token(
      where: {
        fa_contract: { _eq: "${contract}" },
        supply: { _gt: "0" },
        creators: { creator_address: {_eq: "${address}"} }
      }
      limit: ${FA_COLLECTION_PAGINATION_STEP}
      offset: ${offset}
      order_by: { token_id: asc }
    ) {
      ${commonTokenQuery}
      holders {
        holder_address
        quantity
      }
      events(order_by: {timestamp: desc}) {
        event_type
        marketplace_event_type
        price_xtz
        price
        currency_id
        timestamp
      }
    }
  }
`;

export const buildGetCollectiblesByGalleryQuery = (galleryPk: number, offset: number) => gql`
  query MyQuery {
    gallery(
      where: { pk: { _eq: "${galleryPk}"} }
    ) {
      max_items
      tokens(
        limit: ${GALLERY_COLLECTION_PAGINATION_STEP}
        offset: ${offset}
      ) {
        token {
          ${commonTokenQuery}
          fa {
            items
          }
          holders {
            holder_address
            quantity
          }
          events(order_by: {timestamp: desc}) {
            event_type
            marketplace_event_type
            price_xtz
            price
            currency_id
            timestamp
          }
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

export const buildGetCollectiblesQuery = () => gql`
  query CollectiblesQuery($where: token_bool_exp) {
    token(where: $where) {
      ${commonTokenQuery}
      metadata
      timestamp
      fa {
        name
        logo
        items
        editions
      }
      creators {
        holder {
          address
          tzdomain
        }
      }
      royalties {
        decimals
        amount
      }
      galleries {
        gallery {
          name
          editions
          pk
        }
      }
    }
  }
`;

const commonTokenQuery = `
  fa_contract
  token_id
  decimals
  name
  symbol
  description
  mime
  artifact_uri
  display_uri
  thumbnail_uri
  supply
  lowest_ask
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
`;

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
