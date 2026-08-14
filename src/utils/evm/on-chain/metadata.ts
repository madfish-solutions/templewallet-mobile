import axios from 'axios';
import { pickBy } from 'lodash-es';
import { BaseError, erc20Abi, erc721Abi, HttpRequestError, parseAbi, RpcRequestError, TimeoutError } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';
import { toHttpMetadataUri } from 'src/utils/evm/metadata-uri';
import { normalizeIpfsUri } from 'src/utils/image.utils';

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

export interface EvmCollectibleMetadataResolution {
  metadataUri: string;
  remoteMetadata?: ResolvedErc1155Metadata['remoteMetadata'];
}

export const getEvmCollectibleMetadataResolution = async (
  network: EvmNetworkEssentials,
  contract: HexString,
  tokenId = '0',
  standard: EvmCollectibleAssetStandard
): Promise<EvmCollectibleMetadataResolution | null> => {
  try {
    const bigIntTokenId = BigInt(tokenId);

    if (standard === EvmAssetStandard.ERC1155) {
      const rawUri = await executeEvmReadContract<string>(network, {
        address: contract,
        abi: erc1155Abi,
        functionName: 'uri',
        args: [bigIntTokenId]
      });
      if (!rawUri) {
        throw new Error('ERC-1155 contract returned no uri');
      }

      return resolveErc1155Metadata(rawUri, bigIntTokenId);
    }

    const metadataUri = await executeEvmReadContract<string>(network, {
      address: contract,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [bigIntTokenId]
    });
    if (!metadataUri) {
      throw new Error('ERC-721 contract returned no tokenURI');
    }

    return { metadataUri };
  } catch (error) {
    if (isRetryableRpcError(error)) {
      throw error;
    }

    console.error(
      `ChainId: ${network.chainId}. Failed to get collectible metadata URI for: ${contract}_${tokenId}.`,
      error
    );

    return null;
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
    name: getSettledValue(name),
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

  const { metadataUri, remoteMetadata } = await resolveErc1155Metadata(rawUri, tokenId);

  return {
    ...remoteMetadata,
    name: getSettledValue(name),
    symbol: getSettledValue(symbol) ?? remoteMetadata.collectibleName,
    metadataUri
  };
};

const getErc1155CandidateUris = (rawUri: string, tokenId: bigint): string[] => {
  const tokenIdStr = tokenId.toString();

  return [
    ...new Set([
      rawUri.replace('{id}', tokenId.toString(16).padStart(64, '0')),
      rawUri.replace('{id}', tokenIdStr.padStart(64, '0')),
      rawUri.replace('{id}', tokenIdStr)
    ])
  ];
};

interface ResolvedErc1155Metadata {
  metadataUri: string;
  remoteMetadata: Awaited<ReturnType<typeof fetchCollectibleJsonMetadata>>;
}

const resolveErc1155Metadata = async (rawUri: string, tokenId: bigint): Promise<ResolvedErc1155Metadata> => {
  // EIP-1155 requires `{id}` to be the lowercase 64-char hex form; some non-compliant contracts expect decimal.
  const candidateUris = getErc1155CandidateUris(rawUri, tokenId);
  let lastFetchError: unknown;

  for (const metadataUri of candidateUris) {
    try {
      return { metadataUri, remoteMetadata: await fetchCollectibleJsonMetadata(metadataUri) };
    } catch (error) {
      lastFetchError = error;
    }
  }

  throw lastFetchError;
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
  Pick<
    EvmCollectibleOnChainMetadata,
    'collectibleName' | 'image' | 'description' | 'attributes' | 'externalUrl' | 'animationUrl'
  >
> => {
  const httpUri = toHttpMetadataUri(metadataUri);
  if (!httpUri) {
    throw new Error('Could not build an http link from the metadata uri');
  }

  const { data } = await axios.get<CollectibleJsonMetadata>(httpUri);

  if (typeof data !== 'object' || !data.image) {
    throw new Error('Fetched collectible metadata is missing an image');
  }

  const { name, description, image, attributes, external_url: externalUrl, animation_url: animationUrl } = data;

  return {
    collectibleName: name,
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
