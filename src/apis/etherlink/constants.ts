import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export type EtherlinkChainId = typeof ETHERLINK_MAINNET_CHAIN_ID;

export const ETHERLINK_API_BASE_URLS: Record<EtherlinkChainId, string> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: 'https://explorer.etherlink.com/api/v2'
};
