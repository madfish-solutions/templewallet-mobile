import axios from 'axios';
import { pickBy } from 'lodash-es';
import { BaseError, erc20Abi, erc721Abi, HttpRequestError, parseAbi, RpcRequestError, TimeoutError } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';
import { IPFS_GATE, IPFS_PROTOCOL, normalizeIpfsUri } from 'src/utils/image.utils';

import { erc1155Abi } from './abi/erc1155.abi';
import { detectTokenStandard } from './common.utils';
import { executeEvmReadContract } from './evm-rpc-requests-executor';
import {
  EvmAssetStandard,
  EvmCollectibleAssetStandard,
  EvmCollectibleOnChainMetadata,
  EvmTokenOnChainMetadata
} from './types';

const nameAbi = parseAbi(['function name() external view returns (string)']);
const symbolAbi = parseAbi(['function symbol() external view returns (string)']);

const isRetryableRpcError = (error: unknown): boolean =>
  error instanceof BaseError &&
  error.walk(e => e instanceof HttpRequestError || e instanceof TimeoutError || e instanceof RpcRequestError) != null;

const COVALENT_IPFS_GATE = 'https://ipfs.covalenthq.com';

const buildHttpLinkFromUri = (uri?: string): string | undefined => {
  const normalizedUri = normalizeIpfsUri(uri);
  if (!normalizedUri) {
    return undefined;
  }

  if (normalizedUri.startsWith(IPFS_PROTOCOL)) {
    return `${IPFS_GATE}/${normalizedUri.slice(IPFS_PROTOCOL.length)}`;
  }

  return normalizedUri.replace(COVALENT_IPFS_GATE, IPFS_GATE);
};

export const getEvmTokenMetadata = async (
  network: EvmNetworkEssentials,
  contract: HexString
): Promise<EvmTokenOnChainMetadata | undefined> => {
  const [name, symbol, decimals] = await Promise.allSettled([
    executeEvmReadContract<string>(network, { address: contract, abi: nameAbi, functionName: 'name' }),
    executeEvmReadContract<string>(network, { address: contract, abi: symbolAbi, functionName: 'symbol' }),
    executeEvmReadContract<number>(network, { address: contract, abi: erc20Abi, functionName: 'decimals' })
  ]);

  if (decimals.status === 'rejected') {
    if (isRetryableRpcError(decimals.reason)) {
      throw decimals.reason;
    }

    console.error(`ChainId: ${network.chainId}. Failed to get ERC-20 metadata for: ${contract}.`, decimals.reason);

    return undefined;
  }

  return {
    name: getSettledValue(name),
    symbol: getSettledValue(symbol),
    decimals: decimals.value
  };
};

export const getEvmCollectibleMetadata = async (
  network: EvmNetworkEssentials,
  contract: HexString,
  tokenId = '0',
  standard: EvmCollectibleAssetStandard
): Promise<EvmCollectibleOnChainMetadata | undefined> => {
  try {
    const bigTokenId = BigInt(tokenId);

    return standard === EvmAssetStandard.ERC1155
      ? await getErc1155Metadata(network, contract, bigTokenId)
      : await getErc721Metadata(network, contract, bigTokenId);
  } catch (error) {
    if (isRetryableRpcError(error)) {
      throw error;
    }

    console.error(
      `ChainId: ${network.chainId}. Failed to get collectible metadata for: ${contract}_${tokenId}.`,
      error
    );

    return undefined;
  }
};

const getErc721Metadata = async (
  network: EvmNetworkEssentials,
  contract: HexString,
  tokenId: bigint
): Promise<EvmCollectibleOnChainMetadata> => {
  const [name, symbol, tokenUri] = await Promise.allSettled([
    executeEvmReadContract<string>(network, { address: contract, abi: nameAbi, functionName: 'name' }),
    executeEvmReadContract<string>(network, { address: contract, abi: symbolAbi, functionName: 'symbol' }),
    executeEvmReadContract<string>(network, {
      address: contract,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId]
    })
  ]);

  if (tokenUri.status === 'rejected' && isRetryableRpcError(tokenUri.reason)) {
    throw tokenUri.reason;
  }

  const metadataUri = getSettledValue(tokenUri);
  if (!metadataUri) {
    throw new Error('ERC-721 contract returned no tokenURI');
  }

  const remoteMetadata = await fetchCollectibleJsonMetadata(metadataUri);

  return {
    ...remoteMetadata,
    name: remoteMetadata.name ?? getSettledValue(name),
    symbol: getSettledValue(symbol),
    metadataUri
  };
};

const getErc1155Metadata = async (
  network: EvmNetworkEssentials,
  contract: HexString,
  tokenId: bigint
): Promise<EvmCollectibleOnChainMetadata> => {
  const [name, symbol, uri] = await Promise.allSettled([
    executeEvmReadContract<string>(network, { address: contract, abi: nameAbi, functionName: 'name' }),
    executeEvmReadContract<string>(network, { address: contract, abi: symbolAbi, functionName: 'symbol' }),
    executeEvmReadContract<string>(network, {
      address: contract,
      abi: erc1155Abi,
      functionName: 'uri',
      args: [tokenId]
    })
  ]);

  if (uri.status === 'rejected' && isRetryableRpcError(uri.reason)) {
    throw uri.reason;
  }

  const rawUri = getSettledValue(uri);
  if (!rawUri) {
    throw new Error('ERC-1155 contract returned no uri');
  }

  const tokenIdStr = tokenId.toString();

  let metadataUri = rawUri.replace('{id}', tokenIdStr.padStart(64, '0'));
  let remoteMetadata: Awaited<ReturnType<typeof fetchCollectibleJsonMetadata>>;
  try {
    remoteMetadata = await fetchCollectibleJsonMetadata(metadataUri);
  } catch {
    // Some ERC-1155 contracts expect the decimal tokenId rather than the zero-padded hex form
    metadataUri = rawUri.replace('{id}', tokenIdStr);
    remoteMetadata = await fetchCollectibleJsonMetadata(metadataUri);
  }

  return {
    ...remoteMetadata,
    name: remoteMetadata.name ?? getSettledValue(name),
    symbol: getSettledValue(symbol) ?? remoteMetadata.name,
    metadataUri
  };
};

interface CollectibleJsonMetadata {
  name?: string;
  image?: string;
  description?: string;
  attributes?: EvmCollectibleOnChainMetadata['attributes'];
  external_url?: string;
  animation_url?: string;
}

const fetchCollectibleJsonMetadata = async (
  metadataUri: string
): Promise<
  Pick<EvmCollectibleOnChainMetadata, 'name' | 'image' | 'description' | 'attributes' | 'externalUrl' | 'animationUrl'>
> => {
  const httpUri = buildHttpLinkFromUri(metadataUri);
  if (!httpUri) {
    throw new Error('Could not build an http link from the metadata uri');
  }

  const { data } = await axios.get<CollectibleJsonMetadata>(httpUri);

  if (typeof data !== 'object' || !data.image) {
    throw new Error('Fetched collectible metadata is missing an image');
  }

  const { name, description, image, attributes, external_url: externalUrl, animation_url: animationUrl } = data;

  return {
    name,
    image: normalizeIpfsUri(image),
    description,
    ...pickBy({ attributes, externalUrl, animationUrl: normalizeIpfsUri(animationUrl) }, value => value !== undefined)
  };
};

const getSettledValue = <T>(result: PromiseSettledResult<T>) =>
  result.status === 'fulfilled' ? result.value : undefined;

type DetectedEvmAssetMetadata =
  | { standard: EvmAssetStandard.ERC20; metadata: EvmTokenOnChainMetadata }
  | { standard: EvmCollectibleAssetStandard; metadata: EvmCollectibleOnChainMetadata };

export const getEvmAssetMetadata = async (
  network: EvmNetworkEssentials,
  contract: HexString,
  tokenId?: string
): Promise<DetectedEvmAssetMetadata | undefined> => {
  const standard = await detectTokenStandard(network, contract);

  if (standard === EvmAssetStandard.ERC721 || standard === EvmAssetStandard.ERC1155) {
    const metadata = await getEvmCollectibleMetadata(network, contract, tokenId, standard);

    return metadata && { standard, metadata };
  }

  if (standard === EvmAssetStandard.ERC20) {
    const metadata = await getEvmTokenMetadata(network, contract);

    return metadata && { standard, metadata };
  }

  return undefined;
};
