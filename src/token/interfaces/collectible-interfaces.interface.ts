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

type HolderInfo = { holderAddress: string; quantity: number };

type Creators = {
  holder: {
    address: string;
    tzdomain: string;
  };
};

type Collection = {
  name: string;
  logo: string;
  items: number;
};

type Royalties = {
  decimals: number;
  amount: number;
};

type Galleries = {
  gallery: {
    items: number;
    name: string;
  };
};

type ListingsActive = {
  bigmapKey: number;
  currencyId: number;
  price: number;
  marketplaceContract: string;
  currency: {
    type: string;
  };
};

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

export interface CollectibleInterface extends CollectibleCommonInterface, TokenInterface, CollectibleDetailsInterface {}

export interface CollectibleOfferInteface extends CollectibleCommonInterface, TokenInterface, OfferInteface {}
