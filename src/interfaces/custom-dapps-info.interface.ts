export enum DappEnum {
  Exchanges = 'Exchanges',
  Marketplaces = 'Marketplaces',
  Games = 'Games',
  DeFi = 'DeFi',
  Collectibles = 'Collectibles',
  Other = 'Other'
}

type DappType = keyof typeof DappEnum;

export interface CustomDAppInfo {
  name: string;
  dappUrl: string;
  type: DappType;
  logo: string;
  slug: string;
  category: DappType[];
}

export interface CustomDAppsInfo {
  dApps: CustomDAppInfo[];
}
