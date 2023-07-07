import { CollectibleAttributes, CollectibleTag, CurrencyInfo } from '../../apis/objkt/types';
import { TokenInterface } from './token.interface';

interface Offer {
  buyerAddress: string;
  collectionOffer: string | null;
  price: number;
  priceXtz: number;
  bigmapKey: number;
  marketplaceContract: string;
  faContract: string;
  currencyId: number;
}

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
}

interface Royalties {
  decimals: number;
  amount: number;
}

interface Galleries {
  gallery: {
    items: number;
    name: string;
  };
}

export interface ListingsActive {
  bigmapKey: number;
  currencyId: number;
  price: number;
  marketplaceContract: string;
  currency: {
    type: string;
  };
}

export interface CollectibleCommonInterface {
  description: string;
  editions: number;
  isAdultContent?: boolean;
}

interface OfferInteface {
  highestOffer: Offer;
  lowestAsk: number | null;
  holders: HolderInfo[];
  listed: number;
  lastPrice: { price: number | null | undefined } & Omit<CurrencyInfo, 'contract' | 'id'>;
  items: number;
}

export interface CollectibleDetailsInterface extends CollectibleCommonInterface {
  creators: Creators[];
  collection: Collection;
  metadata: string;
  attributes: CollectibleAttributes[];
  tags: CollectibleTag[];
  timestamp: string;
  royalties: Royalties[];
  mime: string;
  galleries: Galleries[];
  listingsActive: ListingsActive[];
  artifactUri?: string;
}

export interface CollectibleOfferInteface extends CollectibleCommonInterface, TokenInterface, OfferInteface {}

export interface CollectibleInterface extends CollectibleCommonInterface, TokenInterface, CollectibleDetailsInterface {}
