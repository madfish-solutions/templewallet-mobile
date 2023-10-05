import type { ContractAbstraction, ContractMethod, ContractProvider } from '@taquito/taquito';

import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';

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

type HolderInfo = { holder_address: string; quantity: number };

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
  metadata: string;
  name: string;
  thumbnail_uri: string;
  supply: number;
  mime: string;
  symbol: string;
  token_id: string;
  holders: HolderInfo[];
  offers_active: ObjktOffer[];
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

export interface ObjktListing {
  amount: number;
  seller_address: string;
  bigmap_key: number;
  currency_id: number;
  price: number;
  marketplace_contract: string;
  currency: {
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

export interface CollectibleDetailsResponse {
  fa_contract: string;
  token_id: string;
  name: string;
  description: string;
  thumbnail_uri: string;
  display_uri: string;
  creators: Creator[];
  fa: Fa;
  metadata: string;
  attributes: CollectibleAttributes[];
  artifact_uri: string;
  tags: CollectibleTag[];
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

export interface ObjktContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    fulfill_offer: (offer_id: number, token_id: number) => ContractMethod<ContractProvider>;
  };
}

export interface FxHashContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    offer_accept: (offer_id: number) => ContractMethod<ContractProvider>;
  };
}
