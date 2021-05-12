import { IconNameEnum } from '../../components/icon/icon-name.enum';

export interface TokenMetadataInterface {
  id?: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  fungible: boolean;
  iconName?: IconNameEnum;
}

export const emptyTokenMetadataInterface: TokenMetadataInterface = {
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  fungible: true
};
