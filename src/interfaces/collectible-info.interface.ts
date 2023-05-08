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
  attributes: {
    attribute: {
      id: number;
      name: string;
      value: string;
      rarity?: number;
    };
  }[];
  timestamp: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  supply: number;
  galleries: {
    gallery: {
      items: number;
    };
  }[];
}
