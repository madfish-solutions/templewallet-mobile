interface TzktAlias {
  alias?: string;
  address: string;
}

export interface TzktTokenTransfer {
  amount: string;
  from: TzktAlias;
  id: number;
  level: number;
  timestamp: string;
  to: TzktAlias;
  token: {
    contract: TzktAlias;
    id: number;
    metadata: {
      name: string;
      symbol: string;
      decimals: string;
      thumbnailUri?: string;
      eth_name?: string;
      eth_symbol?: string;
      eth_contract?: string;
    };
    standard: string;
    tokenId: string;
  };
  transactionId: number;
}

export interface TzktAccountTokenBalance {
  account: TzktAlias;
  balance: string;
  firstLevel: number;
  firstTime: string;
  id: number;
  lastLevel: number;
  lastTime: string;
  token: {
    contract: TzktAlias;
    id: number;
    metadata: {
      artifactUri: string;
      creators: Array<string>;
      decimals: string;
      description: string;
      displayUri: string;
      formats: Array<{ uri: string; mimeType: string }>;
      isBooleanAmount: boolean;
      name: string;
      shouldPreferSymbol: boolean;
      symbol: string;
      tags: Array<string>;
      thumbnailUri: string;
    };
    standard: string;
    tokenId: string;
  };
  transfersCount: number;
}
