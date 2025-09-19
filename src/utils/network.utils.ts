import { showErrorToast } from '../toast/toast.utils';
import { FILM_TOKEN_METADATA, TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';

import { DCP_RPC } from './rpc/rpc-list';

const DCP_NODE_RPC_URL = new URL(DCP_RPC.url).href;

export const isDcpNode = (selectedRpcUrl: string) => {
  try {
    return new URL(selectedRpcUrl).href === DCP_NODE_RPC_URL;
  } catch {
    showErrorToast({ description: 'App loading failed due to RPC URL. Verify the URL and try again.' });

    return false;
  }
};

export const getNetworkGasTokenMetadata = (selectedRpcUrl: string) =>
  isDcpNode(selectedRpcUrl) ? FILM_TOKEN_METADATA : TEZ_TOKEN_METADATA;
