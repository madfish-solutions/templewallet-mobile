import type { ObjktAttribute, ObjktTag, ObjktListing, ObjktHolder, ObjktRoyalty } from 'src/apis/objkt/types';

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

interface Galleries {
  gallery: {
    items: number;
    name: string;
    editions: number;
    pk: number;
  };
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
}

export interface CollectibleDetailsInterface extends CollectibleCommonInterface {
  creators: Creators[];
  collection: Collection;
  metadata: string;
  attributes: ObjktAttribute[];
  tags: ObjktTag[];
  timestamp: string;
  royalties: ObjktRoyalty[];
  galleries: Galleries[];
  isAdultContent: boolean;
}

export interface CollectionItemInterface extends CollectibleCommonInterface {
  lowestAsk: number | null;
  holders: ObjktHolder[];
  items: number;
  lastDeal?: {
    price: number | null;
    currency_id: number;
  };
}
