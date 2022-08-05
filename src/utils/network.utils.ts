import { FILM_TOKEN_METADATA, TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';

const DCP_NODE_RPC_URLS = ['https://rpc.decentralized.pictures'];

export const isDcpNode = (selectedRpcUrl: string) => DCP_NODE_RPC_URLS.includes(selectedRpcUrl);

export const getNetworkGasTokenMetadata = (selectedRpcUrl: string) =>
  isDcpNode(selectedRpcUrl) ? FILM_TOKEN_METADATA : TEZ_TOKEN_METADATA;
