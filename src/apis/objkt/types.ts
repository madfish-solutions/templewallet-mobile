import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { AttributeInfo } from 'src/interfaces/attribute.interface';
import { CollectibleInfo } from 'src/interfaces/collectible-info.interface';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { HolderInfo, Listing, Offer } from 'src/token/interfaces/token-metadata.interface';

import { MarketPlaceEventEnum } from './enums';

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfo[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfo[];
}

export interface CurrencyInfo {
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
  metadata: string;
  name: string;
  thumbnail_uri: string;
  supply: number;
  symbol: string;
  token_id: string;
  holders: HolderInfo[];
  offers_active: Offer[];
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
    price: number | null;
    currency_id: number;
  }[];
  listings_active: Listing[];
  fa: {
    items: number;
  };
}

export interface QueryResponse {
  fa: {
    name: string;
    logo: string;
    creator_address: string;
    contract: string;
    tokens: { display_uri: string }[];
    __typename: ObjktTypeEnum;
  }[];
  gallery: {
    name: string;
    logo: string;
    gallery_id: string;
    tokens: { fa_contract: string }[];
    __typename: ObjktTypeEnum;
  }[];
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
  token: CollectibleInfo[];
}
