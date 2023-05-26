import { CurrencyInfo } from 'src/apis/objkt/interfaces';

import { IconNameEnum } from '../../components/icon/icon-name.enum';

export enum TokenStandardsEnum {
  Fa2 = 'fa2',
  Fa12 = 'fa12'
}

export type HolderAddress = { holder_address: string };

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

export interface TokenMetadataInterface {
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
  description?: string;
  highestOffer?: Offer;
  lowestAsk?: number | null;
  metadata?: string;
  editions?: number;
  holders?: HolderAddress[];
  lastPrice?: { price: number | null } & CurrencyInfo;

  // Stored as separate Record
  exchangeRate?: number;
}

export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  standard: TokenStandardsEnum.Fa12
};
