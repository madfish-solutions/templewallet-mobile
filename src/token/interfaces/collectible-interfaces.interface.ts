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
  mime: string;
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

export interface CollectibleOfferInteface extends TokenInterface, CollectibleCommonInterface, OfferInteface {}
