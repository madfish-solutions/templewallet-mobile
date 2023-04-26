export interface CollectibleInfo {
  description: string;
  creators: {
    holder: {
      tzdomain: string;
      address: string;
    };
  }[];
  collection: {
    name: string;
    logo: string;
  };
}
