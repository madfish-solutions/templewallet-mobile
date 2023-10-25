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

interface CommonTokenInterface {
  fa_contract: string;
  token_id: string;
  decimals: number;
  name: string;
  symbol: string;
  description: string;
  mime: string;
  artifact_uri: string;
  display_uri: string;
  thumbnail_uri: string;
  supply: number;
  lowest_ask: number;
  tags: ObjktTag[];
  attributes: ObjktAttribute[];
  listings_active: ObjktListing[];
}

export interface ObjktCollectionItem extends CommonTokenInterface {
  fa: {
    items: number;
  };
  holders: ObjktHolder[];
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
    price: number | null;
    currency_id: number;
  }[];
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
    pk: number;
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
  token: ObjktCollectionItem[];
}

export interface CollectiblesByGalleriesResponse {
  gallery: { tokens: { token: ObjktCollectionItem; gallery: { max_items: number } }[] }[];
}

export interface CollectiblesBySlugsResponse {
  token: ObjktCollectibleDetails[];
}

export interface ObjktGallery {
  gallery: ObjktGalleryValue;
}

interface ObjktGalleryValue {
  name: string;
  editions: number;
  pk: number;
}

export interface ObjktAttribute {
  attribute: ObjktAttributeValue;
}

interface ObjktAttributeValue {
  id: number;
  name: string;
  value: string;
}

export interface ObjktTag {
  tag: {
    name: string;
  };
}

export interface ObjktListing {
  amount_left: number;
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

export interface ObjktRoyalty {
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

export interface ObjktCollectibleDetails extends CommonTokenInterface {
  fa: Fa;
  creators: Creator[];
  metadata: string;
  timestamp: string;
  royalties: ObjktRoyalty[];
  galleries: Gallery[];
}

export interface ObjktCollectibleExtra {
  offers_active: ObjktOffer[];
}
