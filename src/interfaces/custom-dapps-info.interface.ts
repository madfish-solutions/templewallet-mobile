enum DappTypeCategory {
  Exchanges = 'Exchanges',
  Marketplaces = 'Marketplaces',
  Games = 'Games',
  DeFi = 'DeFi',
  Collectibles = 'Collectibles',
  Other = 'Other'
}

enum DataTypeSlug {
  Quipuswap = 'quipuswap',
  Objkt = 'objkt.com',
  Hen = 'hen',
  Pixelpotus = 'pixelpotus',
  Dogami = 'dogami',
  Tezotopia = 'tezotopia',
  Tezosdomains = 'tezosdomains',
  Plenty = 'plenty',
  Kalamint = 'kalamint',
  Smartlink = 'smartlink',
  Youves = 'youves',
  Crunchy = 'crunchy',
  Aliensfarm = 'aliensfarm',
  Flamedefi = 'flamedefi',
  Kolibri = 'kolibri'
}

export interface CustomDAppInfo {
  name: string;
  dappUrl: string;
  type: string;
  logo: string;
  slug: DataTypeSlug;
  category: [DappTypeCategory];
}

export interface CustomDAppsInfo {
  dApps: CustomDAppInfo[];
}
