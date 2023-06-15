import { FarmTokenStandardEnum } from 'src/enums/farm-token-standard.enum';

interface FarmTokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri?: string;
  categories?: string[];
}

export interface FarmToken {
  contractAddress: string;
  fa2TokenId?: number;
  type: FarmTokenStandardEnum;
  isWhitelisted: boolean | null;
  metadata: FarmTokenMetadata;
}
