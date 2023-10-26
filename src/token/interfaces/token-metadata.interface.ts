import type { IconNameEnum } from 'src/components/icon/icon-name.enum';

export enum TokenStandardsEnum {
  Fa2 = 'fa2',
  Fa12 = 'fa12'
}

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
  standard?: TokenStandardsEnum | null;

  // Stored as separate Record
  exchangeRate?: number;
}

export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  standard: TokenStandardsEnum.Fa12
};
