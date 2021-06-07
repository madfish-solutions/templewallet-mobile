import { IconNameEnum } from '../../components/icon/icon-name.enum';

export interface TokenMetadataInterface {
  id?: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  iconUrl?: string;
}

export interface AssetsMetadataInterface extends TokenMetadataInterface {
  address?: string;
}

export const emptyTokenMetadataInterface: TokenMetadataInterface = {
  address: '',
  name: '',
  symbol: '',
  decimals: 0
};
