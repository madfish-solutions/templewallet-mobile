import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';

export interface TokenMetadataInterface {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  iconUrl?: string;
  type: TokenTypeEnum;
}

export const emptyTokenMetadataInterface: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  type: TokenTypeEnum.FA_1_2
};
