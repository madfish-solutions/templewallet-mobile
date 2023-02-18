import { IconNameEnum } from '../../components/icon/icon-name.enum';

export interface TokenMetadataInterface {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
  standard?: null | 'fa12' | 'fa2';

  // Stored as separate Record
  exchangeRate?: number;
}

export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  standard: 'fa12'
};
