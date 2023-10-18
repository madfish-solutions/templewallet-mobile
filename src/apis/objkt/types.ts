import { MarketPlaceEventEnum } from './enums';

export interface AttributeInfoResponse {
  attribute_id: number;
  editions: number;
  fa_contract?: string;
  gallery_pk?: number;
}

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfoResponse[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfoResponse[];
}

export interface ObjktOffer {
  buyer_address: string;
  price: number;
  currency_id: number;
  bigmap_key: number;
  marketplace_contract: string;
  fa_contract: string;
  __typename: 'offer_active';
}

export type ObjktHolder = { holder_address: string; quantity: number };

export interface ObjktCurrencyInfo {
  symbol: string;
  decimals: number;
  contract: string | null;
  id: string | null;
}

export interface CollectibleResponse {
  artifact_uri: string;
  description: string;
  decimals: number;
  display_uri: string;
  fa_contract: string;
  highest_offer: number;
  last_listed: string;
  last_metadata_update: string;
  lowest_ask: number;
  name: string;
  thumbnail_uri: string;
  supply: number;
  mime: string;
  symbol: string;
  token_id: string;
  holders: ObjktHolder[];
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
    price: number | null;
    currency_id: number;
  }[];
  listings_active: ObjktListing[];
  fa: {
    items: number;
  };
}

export type ObjktCollectionType = 'fa' | 'gallery';

export interface QueryResponse {
  fa: {
    name: string;
    logo: string;
    creator_address: string;
    contract: string;
    tokens: { display_uri: string }[];
    __typename: ObjktCollectionType;
  }[];
  gallery: {
    name: string;
    logo: string;
    gallery_id: string;
    tokens: { fa_contract: string }[];
    __typename: ObjktCollectionType;
  }[];
}

interface TzProfile {
  alias?: string | nullish;
  discord?: string | nullish;
  github?: string | nullish;
  logo?: string | nullish;
  twitter?: string | nullish;
  tzdomain?: string | nullish;
  website?: string | nullish;
}

export interface TzProfilesQueryResponse {
  holder_by_pk: TzProfile;
}

export interface CollectiblesByCollectionResponse {
  token: CollectibleResponse[];
}

export interface CollectiblesByGalleriesResponse {
  gallery: { tokens: { token: CollectibleResponse; gallery: { items: number } }[]; gallery_id: string }[];
}

export interface UserAdultCollectiblesQueryResponse {
  token: ObjktCollectibleDetails[];
}

export interface ObjktAttribute {
  attribute: {
    id: number;
    name: string;
    value: string;
  };
}

export interface ObjktTag {
  tag: {
    name: string;
  };
}

export interface ObjktListing {
  amount: number;
  seller_address: string;
  bigmap_key: number;
  currency_id: number;
  price: number;
  /** E.g. `KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC` */
  marketplace_contract: string;
  currency: {
    /** Known values: 'xtz' | 'fa2' | 'fa12' */
    type: string;
  };
}

interface Creator {
  holder: {
    address: string;
    tzdomain: string;
  };
}

interface Fa {
  name: string;
  logo: string;
  items: number;
  editions: number;
}

interface Royalty {
  decimals: number;
  amount: number;
}

interface Gallery {
  gallery: {
    items: number;
    name: string;
    editions: number;
    pk: number;
  };
}

export interface ObjktCollectibleDetails {
  fa_contract: string;
  token_id: string;
  name: string;
  description: string;
  thumbnail_uri: string;
  display_uri: string;
  creators: Creator[];
  fa: Fa;
  metadata: string;
  attributes: ObjktAttribute[];
  artifact_uri: string;
  tags: ObjktTag[];
  timestamp: string;
  royalties: Royalty[];
  supply: number;
  mime: string;
  galleries: Gallery[];
  listings_active: ObjktListing[];
}

export interface ObjktCollectibleExtra {
  offers_active: ObjktOffer[];
}
