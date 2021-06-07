import { IconNameEnum } from '../../components/icon/icon-name.enum';

export interface TokenMetadataInterface {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  iconUrl?: string;
}

export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0
};
