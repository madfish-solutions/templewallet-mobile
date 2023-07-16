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
  amount?: number;
  sellerAddress?: string;
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
  listingsActive: ListingsActive[];
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
  address: string;
  id: number;
  name: string;
  creators: Creators[];
  collection: Collection;
  metadata: string;
  attributes: CollectibleAttributes[];
  tags: CollectibleTag[];
  timestamp: string;
  royalties: Royalties[];
  mime: string;
  galleries: Galleries[];
  artifactUri?: string;
  thumbnailUri?: string;
}

export interface CollectibleInterface
  extends Omit<CollectibleDetailsInterface, 'address' | 'id' | 'name'>,
    TokenInterface {}

export interface CollectibleOfferInteface extends TokenInterface, CollectibleCommonInterface, OfferInteface {}
