export type EtherlinkTokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export interface EtherlinkTokenInfo<T extends EtherlinkTokenType = EtherlinkTokenType> {
  icon_url: string | null;
  name: string | null;
  decimals: string | null;
  symbol: string | null;
  address: HexString;
  address_hash: HexString;
  type: T;
  exchange_rate: string | null;
}

export interface EtherlinkAccountInfo {
  coin_balance: string | null;
  exchange_rate: string | null;
  hash: HexString;
}

interface EtherlinkAddressParam {
  hash: HexString;
  name: string | null;
}

interface EtherlinkNFTMetadata {
  attributes: Array<{ trait_type: string; value: string }> | null;
  description: string | null;
  image: string | null;
  name: string | null;
}

interface EtherlinkNFTInstance {
  id: string;
  animation_url: string | null;
  external_app_url: string | null;
  image_url: string | null;
  media_type: string | null;
  media_url: string | null;
  token: EtherlinkTokenInfo<'ERC-721' | 'ERC-1155'>;
  metadata: EtherlinkNFTMetadata | null;
  owner: EtherlinkAddressParam | null;
}

export interface EtherlinkAddressNftInstance extends Omit<EtherlinkNFTInstance, 'owner'> {
  value: string;
}

export interface EtherlinkTokenBalance {
  token_instance: EtherlinkNFTInstance | null;
  token_id: string | null;
  token: EtherlinkTokenInfo;
  value: string;
}

interface EtherlinkERC20TokenBalance extends EtherlinkTokenBalance {
  token: EtherlinkTokenInfo<'ERC-20'>;
  token_id: null;
  token_instance: null;
}

export const isErc20TokenBalance = (balance: EtherlinkTokenBalance): balance is EtherlinkERC20TokenBalance =>
  balance.token.type === 'ERC-20';

interface ItemsWithPagination<T, P> {
  items: T[];
  next_page_params: P | null;
}

export interface EtherlinkAccountNftsPageParams {
  items_count: number;
  token_contract_address_hash: HexString;
  token_id: string;
  token_type: Exclude<EtherlinkTokenType, 'ERC-20'>;
}

export type EtherlinkAccountNftsResponse = ItemsWithPagination<
  EtherlinkAddressNftInstance,
  EtherlinkAccountNftsPageParams
>;
