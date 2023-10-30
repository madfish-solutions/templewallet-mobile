import type { IconNameEnum } from 'src/components/icon/icon-name.enum';
import type { AssetMediaURIs } from 'src/utils/assets/types';

export enum TokenStandardsEnum {
  Fa2 = 'fa2',
  Fa12 = 'fa12'
}

export interface TokenMetadataInterface extends AssetMediaURIs {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconName?: IconNameEnum;
  /** @deprecated // Lost in Redux at the moment */
  displayUri?: string;
  standard?: TokenStandardsEnum | null;
}

/** @deprecated // BAD PRACTICE !!! */
export const emptyTokenMetadata: TokenMetadataInterface = {
  id: 0,
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  standard: TokenStandardsEnum.Fa12
};
