import type {
  ObjktGallery,
  ObjktAttribute,
  ObjktTag,
  ObjktListing,
  ObjktHolder,
  ObjktRoyalty
} from 'src/apis/objkt/types';

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

interface CollectibleCommonInterface {
  address: string;
  id: string;
  name: string;
  description: string;
  editions: number;
  listingsActive: ObjktListing[];
  mime: string;
  artifactUri?: string;
  thumbnailUri?: string;
  displayUri?: string;
  isAdultContent: boolean;
}

export interface CollectibleDetailsInterface extends CollectibleCommonInterface {
  creators: Creators[];
  collection: Collection;
  metadata: string;
  attributes: ObjktAttribute[];
  tags: ObjktTag[];
  timestamp: string;
  royalties: ObjktRoyalty[];
  galleries: ObjktGallery[];
}

export interface CollectionItemInterface extends CollectibleCommonInterface {
  lowestAsk: number | null;
  holders: ObjktHolder[];
  collectionSize: number;
  lastDeal?: {
    price: number | null;
    currency_id: number;
  };
}
