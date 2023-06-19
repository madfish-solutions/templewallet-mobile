interface CollectibleAttributes {
  attribute: {
    id: number;
    name: string;
    value: string;
    rarity?: number;
  };
}
[];

export interface UserAdultCollectibles {
  fa_contract: string;
  token_id: string;
}

export interface ListingInfo {
  bigmap_key: number;
  currency_id: number;
  price: number;
  marketplace_contract: string;
  currency: {
    type: string;
  };
}

export interface CollectibleInfo {
  description: string;
  creators: {
    holder: {
      address: string;
      tzdomain: string;
    };
  }[];
  fa: {
    name: string;
    logo: string;
    items: number;
  };
  metadata: string;
  artifact_uri: string;
  attributes: CollectibleAttributes[];
  timestamp: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  supply: number;
  mime: string;
  galleries: {
    gallery: {
      items: number;
      name: string;
    };
  }[];
  listings_active: ListingInfo[];
}
