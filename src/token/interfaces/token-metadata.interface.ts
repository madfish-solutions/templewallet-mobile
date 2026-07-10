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

export enum EvmAssetStandardEnum {
  NATIVE = 'native',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155'
}

export const EVM_TOKEN_SLUG = 'eth';

interface EvmAssetMetadataBase {
  address: typeof EVM_TOKEN_SLUG | HexString;
  standard?: EvmAssetStandardEnum;
  /** contract name (for nft contract refers to collection name) */
  name?: string;
  /** contract symbol (for nft contract refers to collection symbol) */
  symbol?: string;
  /** contract decimals (could be available only for ERC20 tokens and native currency) */
  decimals?: number;
  /** A fallback for icon URL */
  iconURL?: string;
}

export interface EvmNativeTokenMetadata
  extends RequiredBy<EvmAssetMetadataBase, Exclude<keyof EvmAssetMetadataBase, 'iconURL'>> {
  standard: EvmAssetStandardEnum.NATIVE;
  address: typeof EVM_TOKEN_SLUG;
}

export const DEFAULT_EVM_CURRENCY: EvmNativeTokenMetadata = {
  address: EVM_TOKEN_SLUG,
  standard: EvmAssetStandardEnum.NATIVE,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18
};
