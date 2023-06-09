import { CurrencyInfo } from 'src/apis/objkt/interfaces';

import { IconNameEnum } from '../../components/icon/icon-name.enum';

export enum TokenStandardsEnum {
  Fa2 = 'fa2',
  Fa12 = 'fa12'
}

export type HolderInfo = { holder_address: string; quantity: number };

export interface Offer {
  buyer_address: string;
  collection_offer: string | null;
  price: number;
  price_xtz: number;
  bigmap_key: number;
  marketplace_contract: string;
  fa_contract: string;
  currency_id: number;
}

export interface Listing {
  amount: number;
  seller_address: string;
}

export type TokenMetadataInterface = CollectibleMetadataInterface & {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
  standard?: TokenStandardsEnum | null;

  // Stored as separate Record
  exchangeRate?: number;
};

interface CollectibleMetadataInterface {
  description?: string;
  highestOffer?: Offer;
  lowestAsk?: number | null;
  metadata?: string;
  editions?: number;
  holders?: HolderInfo[];
  listed?: number;
  lastPrice?: { price: number | null } & CurrencyInfo;
  items?: number;
}

export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  standard: TokenStandardsEnum.Fa12
};
