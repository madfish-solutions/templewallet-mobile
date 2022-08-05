import { FILM_TOKEN_METADATA, TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { DCP_RPC } from './rpc/rpc-list';

const DCP_NODE_RPC_URLS = [DCP_RPC.url];

export const isDcpNode = (selectedRpcUrl: string) => DCP_NODE_RPC_URLS.includes(selectedRpcUrl);

export const getNetworkGasTokenMetadata = (selectedRpcUrl: string) =>
  isDcpNode(selectedRpcUrl) ? FILM_TOKEN_METADATA : TEZ_TOKEN_METADATA;
