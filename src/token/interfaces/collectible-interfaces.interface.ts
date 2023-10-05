import { CollectibleAttributes, CollectibleTag, ObjktCurrencyInfo, ObjktListing } from 'src/apis/objkt/types';

import { TokenInterface } from './token.interface';

interface HolderInfo {
  holderAddress: string;
  quantity: number;
}

interface Creators {
  holder: {
    address: string;
    tzdomain: string;
  };
}

interface Collection {
  name: string;
  logo: string;
  items: number;
  editions: number;
}

interface Royalties {
  decimals: number;
  amount: number;
}

interface Galleries {
  gallery: {
    items: number;
    name: string;
    editions: number;
    pk: number;
  };
}

export type ListingActive = ObjktListing;

export interface CollectibleCommonInterface {
  description: string;
  editions: number;
  isAdultContent?: boolean;
  listingsActive: ListingActive[];
  mime: string;
}

interface OfferInteface {
  lowestAsk: number | null;
  holders: HolderInfo[];
  lastPrice: { price: number | null | undefined } & Omit<ObjktCurrencyInfo, 'contract' | 'id'>;
  items: number;
}

export interface CollectibleDetailsInterface extends CollectibleCommonInterface {
  address: string;
  id: string;
  name: string;
  creators: Creators[];
  collection: Collection;
  metadata: string;
  attributes: CollectibleAttributes[];
  tags: CollectibleTag[];
  timestamp: string;
  royalties: Royalties[];
  galleries: Galleries[];
  artifactUri?: string;
  thumbnailUri?: string;
  displayUri?: string;
}

export interface CollectibleInterface
  extends Omit<CollectibleDetailsInterface, 'address' | 'id' | 'name'>,
    Omit<TokenInterface, 'displayUri'> {}

/** @deprecated // What is this creature ?!) */
export interface CollectibleOfferInteface
  extends Omit<TokenInterface, 'balance' | 'visibility' | 'decimals' | 'symbol'>,
    CollectibleCommonInterface,
    OfferInteface {}
