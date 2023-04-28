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
  };
  metadata: string;
  artifact_uri: string;
  attributes: {
    attribute: {
      name: string;
      value: string;
    };
  }[];
  timestamp: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  supply: number;
}
