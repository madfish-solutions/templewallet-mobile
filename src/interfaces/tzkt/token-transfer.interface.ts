interface TzktAlias {
  alias?: string;
  address: string;
}

export interface TzktTokenTransfer {
  amount: string;
  from?: TzktAlias;
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
