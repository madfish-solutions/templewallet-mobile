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

export const isEtherlinkCollectibleTokenType = (type: string): type is Exclude<EtherlinkTokenType, 'ERC-20'> =>
  type === 'ERC-721' || type === 'ERC-1155';

export interface EtherlinkAccountNftsPageParams {
  items_count: number;
  token_contract_address_hash: HexString;
  token_id: string;
  token_type: Exclude<EtherlinkTokenType, 'ERC-20'>;
}

export interface EtherlinkAccountNftsResponse {
  items: EtherlinkAddressNftInstance[];
  next_page_params: EtherlinkAccountNftsPageParams | null;
}

interface ItemsWithPagination<T, P> {
  items: T[];
  next_page_params: P | null;
}

interface EtherlinkInputParameter {
  name: string;
  type: string;
  value: unknown;
}

export interface EtherlinkDecodedInput {
  method_call: string;
  method_id: string;
  parameters: EtherlinkInputParameter[];
}

type EtherlinkTransactionType =
  | 'token_transfer'
  | 'contract_creation'
  | 'contract_call'
  | 'token_creation'
  | 'coin_transfer';

export interface EtherlinkTransaction {
  hash: HexString;
  timestamp: string;
  block_number: number;
  from: EtherlinkAddressParam;
  to: EtherlinkAddressParam | null;
  position: number;
  transaction_types: EtherlinkTransactionType[];
  status: 'ok' | 'error';
  value: string;
  decoded_input: EtherlinkDecodedInput | null;
  created_contract: EtherlinkAddressParam | null;
  raw_input: HexString;
  fee: { type: 'maximum' | 'actual'; value: string } | null;
}

export interface EtherlinkAccountTransactionsPageParams {
  block_number: number;
  fee: string;
  hash: string;
  index: number;
  inserted_at: string;
  items_count: number;
  value: string;
}

export type EtherlinkAccountTransactionsResponse = ItemsWithPagination<
  EtherlinkTransaction,
  EtherlinkAccountTransactionsPageParams
>;

export interface EtherlinkInternalTransaction {
  block_index: number;
  index: number;
  from: EtherlinkAddressParam;
  to: EtherlinkAddressParam | null;
  value: string;
}

export interface EtherlinkInternalTransactionsPageParams {
  block_number: number;
  index: number;
  items_count: number;
  transaction_index: number;
}

export type EtherlinkTransactionInternalTransactionsResponse = ItemsWithPagination<
  EtherlinkInternalTransaction,
  EtherlinkInternalTransactionsPageParams
>;

interface EtherlinkTotalErc20 {
  decimals: string;
  value: string;
}

interface EtherlinkTotalErc721 {
  token_id: string;
  token_instance: EtherlinkNFTInstance | null;
}

interface EtherlinkTotalErc1155 {
  token_id: string;
  decimals: string;
  value: string;
  token_instance: EtherlinkNFTInstance | null;
}

interface EtherlinkTokenTransferBase {
  log_index: number;
  block_hash: HexString;
  block_number: number;
  transaction_hash: HexString;
  timestamp: string;
  from: EtherlinkAddressParam;
  to: EtherlinkAddressParam;
  token: EtherlinkTokenInfo;
  total: EtherlinkTotalErc20 | EtherlinkTotalErc721 | EtherlinkTotalErc1155;
}

interface EtherlinkTokenTransferErc20 extends EtherlinkTokenTransferBase {
  token: EtherlinkTokenInfo<'ERC-20'>;
  total: EtherlinkTotalErc20;
}

interface EtherlinkTokenTransferErc721 extends EtherlinkTokenTransferBase {
  token: EtherlinkTokenInfo<'ERC-721'>;
  total: EtherlinkTotalErc721;
}

interface EtherlinkTokenTransferErc1155 extends EtherlinkTokenTransferBase {
  token: EtherlinkTokenInfo<'ERC-1155'>;
  total: EtherlinkTotalErc1155;
}

export type EtherlinkTokenTransfer =
  | EtherlinkTokenTransferErc20
  | EtherlinkTokenTransferErc721
  | EtherlinkTokenTransferErc1155;

export const isErc20TokenTransfer = (transfer: EtherlinkTokenTransfer): transfer is EtherlinkTokenTransferErc20 =>
  transfer.token.type === 'ERC-20';

export const isErc721TokenTransfer = (transfer: EtherlinkTokenTransfer): transfer is EtherlinkTokenTransferErc721 =>
  transfer.token.type === 'ERC-721';

export interface EtherlinkTokenTransfersPageParams {
  block_number: number;
  index: number;
}

export type EtherlinkAccountTokenTransfersResponse = ItemsWithPagination<
  EtherlinkTokenTransfer,
  EtherlinkTokenTransfersPageParams
>;

export type EtherlinkTransactionTokenTransfersResponse = ItemsWithPagination<
  EtherlinkTokenTransfer,
  EtherlinkTokenTransfersPageParams
>;

export interface EtherlinkLog {
  address: EtherlinkAddressParam;
  data: HexString;
  decoded: EtherlinkDecodedInput | null;
  topics: Array<HexString | null>;
  index: number;
}

export interface EtherlinkTransactionLogsPageParams {
  block_number: number;
  index: number;
  items_count: number;
}

export type EtherlinkTransactionLogsResponse = ItemsWithPagination<EtherlinkLog, EtherlinkTransactionLogsPageParams>;

export interface EtherlinkCoinBalanceHistoryItem {
  block_number: number;
  block_timestamp: string;
  delta: string;
  transaction_hash: HexString | null;
  value: string;
}

export interface EtherlinkCoinBalanceHistoryPageParams {
  block_number: number;
  items_count: number;
}

export type EtherlinkAccountCoinBalanceHistoryResponse = ItemsWithPagination<
  EtherlinkCoinBalanceHistoryItem,
  EtherlinkCoinBalanceHistoryPageParams
>;
