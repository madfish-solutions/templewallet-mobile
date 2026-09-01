export interface MtPelerinCurrenciesResponse {
  timestamp: number;
  cryptoTokens: MtPelerinToken[];
  fiatCurrencies: MtPelerinFiatCurrency[];
}

export interface MtPelerinToken {
  network: MtPelerinNetwork;
  iconUrl: string;
  symbol: string;
  name: string;
  id: string;
  networkName: string;
  decimals: number;
  address: string;
  isStable: boolean;
  networkFee?: number;
  forceNetworkFee?: boolean;
  tokenId?: number;
}

export interface MtPelerinFiatCurrency {
  iconUrl: string;
  symbol: string;
  name: string;
  isBuySupported: boolean;
  isSellSupported: boolean;
}

type MtPelerinNetwork =
  | 'arbitrum_mainnet'
  | 'avalanche_mainnet'
  | 'base_mainnet'
  | 'bitcoin_mainnet'
  | 'bsc_mainnet'
  | 'celo_mainnet'
  | 'fantom_mainnet'
  | 'lightning_mainnet'
  | 'mainnet'
  | 'matic_mainnet'
  | 'optimism_mainnet'
  | 'rsk_mainnet'
  | 'sonic_mainnet'
  | 'tempo_mainnet'
  | 'tezos_mainnet'
  | 'xdai_mainnet'
  | 'zksync_mainnet';

export interface MtPelerinQuote {
  fees: {
    networkFee: string | number;
    fixFee: string | number;
  };
  destAmount: string;
}

export interface MtPelerinSellLimitResponse {
  destCurrency: string;
  limit: string | number;
}

export interface BuildMtPelerinBuyUrlParams {
  fiatCode: string;
  cryptoCode: string;
  sourceAmount: number;
  network: 'tezos_mainnet';
  accountPkh: string;
  publicKey: string;
  code: string;
  signature: string;
}

export interface MtPelerinAddressProof {
  accountPkh: string;
  publicKey: string;
  code: string;
  signature: string;
}
