export interface TokenBalanceInterface {
  account: { address: string };
  balance: string;
  firstLevel: number;
  firstTime: string; // date
  id: string;
  lastLevel: number;
  lastTime: string; //date
  token: {
    contract: {
      alias?: string;
      address: string;
    };
    id: string;
    metadata: {
      artifactUri?: string;
      creators?: Array<string>;
      deciamls?: string;
      description?: string;
      displayUri?: string;
      formats?: Array<{ uri?: string; mimeType?: string }>;
      isBooleanAmount?: boolean;
      name: string;
      shouldPreferSymbol?: boolean;
      symbol: string;
      tags?: Array<string>;
      thumbnailUri?: string;
    };
    standard: 'fa2' | 'fa1.2';
    tokenId?: string;
  };
  transfersCount: number;
}
