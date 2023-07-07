import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';

import { MarketPlaceEventEnum } from './enums';

export interface AttributeInfoResponse {
  attribute_id: number;
  tokens: number;
}

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfoResponse[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfoResponse[];
}

interface OfferResponse {
  buyer_address: string;
  collection_offer: string | null;
  price: number;
  price_xtz: number;
  bigmap_key: number;
  marketplace_contract: string;
  fa_contract: string;
  currency_id: number;
}

type HolderInfo = { holder_address: string; quantity: number };

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
  offers_active: OfferResponse[];
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
    price: number | null;
    currency_id: number;
  }[];
  listings_active: ListingResponse[];
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
  token: CollectibleDetailsResponse[];
}

export interface CollectibleAttributes {
  attribute: {
    id: number;
    name: string;
    value: string;
    rarity?: number;
  };
}

export interface CollectibleTag {
  tag: {
    name: string;
  };
}

interface ListingsActiveResponse {
  bigmap_key: number;
  currency_id: number;
  price: number;
  marketplace_contract: string;
  currency: {
    type: string;
  };
}

interface ListingResponse extends ListingsActiveResponse {
  amount: number;
  seller_address: string;
}

export interface CollectibleDetailsResponse {
  fa_contract: string;
  token_id: string;
  description: string;
  creators: {
    holder: {
      address: string;
      tzdomain: string;
    };
  }[];
  fa: {
    name: string;
    logo: string;
    items: number;
  };
  metadata: string;
  attributes: CollectibleAttributes[];
  artifact_uri?: string;
  tags: CollectibleTag[];
  timestamp: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  supply: number;
  mime: string;
  galleries: {
    gallery: {
      items: number;
      name: string;
    };
  }[];
  listings_active: ListingsActiveResponse[];
  isAdultContent?: boolean;
}

export interface CollectibleFloorPriceQueryResponse {
  token: {
    listings_active: ListingsActiveResponse[];
  }[];
}
