interface TzktAlias {
  alias?: string;
  address: string;
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
    metadata?: {
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
