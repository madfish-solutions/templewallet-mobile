import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';

interface EarnOpportunityTokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri?: string;
  categories?: string[];
}

export interface EarnOpportunityToken {
  contractAddress: string;
  fa2TokenId?: number;
  type: EarnOpportunityTokenStandardEnum;
  isWhitelisted: boolean | null;
  metadata: EarnOpportunityTokenMetadata;
}
